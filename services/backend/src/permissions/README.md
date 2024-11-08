# Permission types and node trees
There are 3 types of permissions - `static`, `user` and `group`. They are based on `PermissionNode` type. The base type makes it possible to unite permissions into permission trees, by representing `key` and `permissions` properties. In context of permission trees permissions are often called `nodes`. A permission tree can use only one type of permission nodes, for representing its structure.

Common concepts for `static`, `user`, `group` permission types:
* base node/permission - every node tree has a first permission node that starts that tree. An object of a base permission represent entrypoint for the whole tree.
* tree structure - each permission can have as many child permissions as it needed.
* paths - a tree of permissions implicitly has paths for every nested permission. Property `key` helps to identify permissions on a path.

A node by itself only represents some part of its tree. It doesn't have any information about its parents or position on the tree. All it has are `key` and `permission` properties. Example of a tree:
```
profile +-------+ change-pfp.<userId> +-----+ own
         \                             \
          \                             +---+ others
           \
            +---+ delete-pfp.<userId> +-----+ own
             \                         \
              \                         +---+ others
               \
                +---+ change-nickname.<...>.[...]

Available paths:
- profile

- profile.change-pfp.<userId>
- profile.change-pfp.own
- profile.change-pfp.others

- profile.delete-pfp.<userId>
- profile.delete-pfp.own
- profile.delete-pfp.others

- profile.change-nickname.<...>.[...]
```


# Purpose of static, user and group permissions
Static permissions represent registered permissions (aka permission trees) of a whole application. They are stored in `static-permissions-storage` and used for describing parameters of user permissions. We can authorize a user with some static permissions or a set of them, or restrict some of them.

Group permissions are used for describing a named set of static permissions. Then we can just add a user to a specific group to grant permissions of that group. Group permissions can refer to some parts of static permissions. Both `static` and `group` permissions cannot restrict permissions and cannot describe a set of them by wildcards.


# Parameters and arguments
Permissions of `static` type can have parameters. There are `required` and `optional` parameter types that are used to describe a permission's parameters.

When a `user` permission node is being created, described arguments have to be supplied, according to the referenced `static` node. Required arguments have to be strictly provided to the `user` node, but optional arguments can be omitted.


# Merge process
Lists of permissions is passed through the merge process, when is set to the `PermissionsModule` options. Alike permissions are grouped in arrays, by equal keys of their base permissions, and then these groups are merged together.

Merge conflicts are resolved by the main rule - **a next permission always overrides conflicting data of a previous one**. So the options init sequence matters. Group permissions are merged too, but withing own group scopes, using the same merge rule.

User permissions are not merged since there is no such need.


# User permissions: wildcards, intermediates, priorities
User permissions are path specific. It means that we always grant the last one permission node from a path, but not all permissions on that path. Examples:
```
# Tree
profile.change-pfp.others
                  .own

#1
Granted: [ profile.change-pfp ]
Allowed only: profile.change-pfp

#2
Granted: [ profile.change-pfp.others ]
Allowed only: profile.change-pfp.others

#3
Granted: [ profile ]
Allowed only: profile
```


A user permission node can describe a set of its granted sub-permissions, using wildcards. Wildcards have these three states: unset, positive, negative. Examples:
```
# Tree
profile.change-pfp.others

#1
Granted: [ profile.change-pfp.* ]
Allowed: all child permissions of "change-pfp",
         but not "change-pfp"

#2
Granted: [ profile.change-pfp, profile.change-pfp.* ]
Allowed: "profile.change-pfp" and all its child permissions

#3
Granted: [ profile.*, -profile.change-pfp, -profile.change-pfp.* ]
Allowed: all sub-permissions of the "profile" node,
         but except:
         - "profile.change-pfp"
         - "profile.change-pfp.*"
```


A user permission node is intermediate if it has unset its positiveness and wildcard. Intermediate means that a permission represents only its tree structure and has no any effect on the current node. A permission is not intermediate or has effect .. :
* if a wildcard is set. Then it describes access (positive or negative) to child permissions of a current node.
* if positiveness is set. Then it describes access (positive or negative) to a current node.
* if both wildcard and positiveness are set.

Examples of intermediate permissions:
```
# Tree
profile.change-pfp.others

#1
Granted: [ profile.change-pfp.* OR -profile.change-pfp.* ]
Path fragments "profile" and "change-pfp" are intermediate.

#2
Granted: [ -profile.change-pfp, profile.change-pfp.* ]
Fragment "profile" is intermediate.
Permission "profile.change-pfp" has negative (restricted) effect.
Sub-permissions of "profile.change-pfp" have positive effect.
```


With help of wildcards and positiveness user permissions are very flexible in a process of describing permission scopes. Sequence of some user's permissions plays a crucial role in permission priorities. The priority rule - **the last one active permission only has effect on a tested path**. It means that if there were other active permissions, that had been triggered for the tested path, then the only last of them would have an effect. Examples:
```
# Tree
profile.change-pfp.<userId>
                  .own
                  .others

profile.delete-pfp.<userId>
                  .own
                  .others

#1
Granted:
[ -profile.change-pfp.*, profile.change-pfp.own ]
Restricted every subpath of "profile.change-pfp", but not "profile.change-pfp" itself.
Allowed only: profile.change-pfp.own

#2
Granted: [ -*, profile.change-pfp.id-125526 ]
Denied all permissions except "profile.change-pfp" with argument "id-125526".

#3
Granted: [ -*, *, -profile.change-pfp ]
Allowed all available paths except "profile.change-pfp".
Note the global positive wildcard after the negative one.

#4
Granted: [ profile.change-pfp.others, -profile.change-pfp.id-12345 ]
Allowed "profile.change-pfp.others" except "profile.change-pfp" with argument "id-12345".

#5
Granted: [ *, -profile.* ]
Allowed all available paths except sub-paths of "profile".
```