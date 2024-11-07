# Permission trees
Both `static` and `user` permissions share the same representation structure. Common concepts:
* base/root permission - base permissions represent the first node of a tree.
* the tree form - each permission can have as many child permissions as it needs.
* merge process - permissions with same base keys can be merged into a one permission/tree. When common/conflicting subtrees are met, the last permission always overrides conflicting data.
* permission key - a tree of permissions implicitly constructs a path. Each permission instance on a certain path represents node of the path by the key property. The key must be unique for each local array of permissions.

Each permission by itself only represents some node of a tree. It doesn't store information about its parents or a position in the tree. Key and child permissions, that's what forms a tree. Example:
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


# Static and user permissions
Static permissions describe pattern of a user permission. They consist of these main properties:
* key
* child/embedded permissions
* params (required and optional)

User permissions reproduce static permissions (usually some parts) and include additional data. Main properties:
* key - implicitly refers to a key of a static permission.
* child/embedded permissions
* permission positiveness - is effect of a permission positive or negative.
* wildcard (positiveness and presence) - wildcard's effect or presence.
* arguments - param arguments of a current permission.

# Parameters and arguments

# 

# Scopes
Scopes is a topic related to user permissions. It is based on concepts of: positiveness, wildcards and position.

All user permissions are path specific. It means that we always grant a permission by exact path. Permissions with wildcards grant only child permissions, but not themselves by default. Examples:
```
# Tree
profile.change-pfp.others

#1
Granted: [ profile.change-pfp ]
Allowed only: profile.change-pfp

#2
Granted: [ profile.change-pfp.others ]
Allowed only: profile.change-pfp.others

#3
Granted: [ profile.change-pfp.* ]
Allowed all child permissions of "change-pfp", but "not change-pfp"

#4
Granted: [ profile.change-pfp, profile.change-pfp.* ]
Allowed: "profile.change-pfp" and all its child permissions
```




Every user permission has a priority that depends on a permission position in the permissions stack. A next permission overrides previous permission or some parts of it. Examples with positiveness and priorities:
```
# Tree
profile.change-pfp.<userId>
                  .own
                  .others

profile.delete-pfp.<userId>
                  .own
                  .others

#1
Granted: [ -profile.change-pfp.*, profile.change-pfp.own ]
Denied every subpath of "profile.change-pfp", but not "profile.change-pfp" itself.
Allowed only: profile.change-pfp.own

#2
Granted: [ -*, profile.change-pfp.id-125526 ]
Denied all permissions except "profile.change-pfp" with argument "id-125526".

#3
Granted: [ -*, *, -profile.change-pfp ]
Allowed all available paths except "profile.change-pfp".

#4
Granted: [ profile.change-pfp.others, -profile.change-pfp.id-12345 ]
Allowed "profile.change-pfp.others" except "profile.change-pfp" with argument "id-12345".

#5
Granted: [ *, -profile.* ]
Allowed all available paths except sub-paths of "profile".
```