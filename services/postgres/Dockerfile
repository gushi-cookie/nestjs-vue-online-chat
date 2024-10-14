FROM postgres:17.0

ARG pg_uid
ENV pg_uid=${pg_uid}

ARG pg_gid
ENV pg_gid=${pg_gid}

RUN usermod -u $pg_uid postgres; groupmod -g $pg_gid postgres