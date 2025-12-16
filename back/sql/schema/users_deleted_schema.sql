--Intended to be long-term/perm record unaffected by cascades/updates.
create table if not exists users_deleted (
    users_id        integer not null,
    deleted_id     integer not null
);