create table if not exists users_creation (
    users_id    integer not null,
    creation_id integer not null,
    foreign key (users_id) references users (id)
        on update cascade
        on delete cascade,
    foreign key (creation_id) references creation (id)
        on update cascade
        on delete cascade
);