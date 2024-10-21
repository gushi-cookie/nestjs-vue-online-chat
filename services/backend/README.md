# Known bugs
## (sequelize-typescript OR @nestjs/sequelize) - Insertions hanging instead throwing errors.
Query (promise) hangs when performing database insertions on nest lifecycle events (onModuleInit, onApplicationBootstrap), when a foreign key not presented in the foreign table. Example:
```
ModelA has primary key id.
ModelB has foreign key a_id.

If try to insert data which have a_id not presented in ModelA's table, during nest lifecycle events, then query (promise) hangs. An error is expected in such cases.

Everything works fine when an insertion query is deferred, for example, by schedule timers (setTimeout(?, 2000), etc).
```