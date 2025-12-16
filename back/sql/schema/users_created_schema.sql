create table if not exists users_created (
    users_id    integer not null,
    created_id integer not null,
    foreign key (users_id) references users (id)
        on update cascade
        on delete cascade,
    foreign key (created_id) references created (id)
        on update cascade
        on delete cascade
);