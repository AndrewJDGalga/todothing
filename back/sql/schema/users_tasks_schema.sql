create table if not exists users_tasks (
    users_id         integer not null,
    tasks_id    integer not null,
    foreign key (users_id) references users (id)
        on update cascade
        on delete cascade,
    foreign key (tasks_id) references tasks (id)
        on update cascade
        on delete cascade
);