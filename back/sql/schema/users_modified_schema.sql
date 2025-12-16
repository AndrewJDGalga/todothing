create table if not exists users_modified (
    users_id    integer not null,
    modified_id integer not null,
    foreign key (users_id) references users (id)
        on update cascade
        on delete cascade,
    foreign key (modified_id) references modified (id)
        on update cascade
        on delete cascade
);