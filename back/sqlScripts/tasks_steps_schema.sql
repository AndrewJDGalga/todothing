create table if not exists tasks_steps (
    tasks_id    integer not null,
    steps_id    integer not null,
    foreign key (tasks_id) references tasks (id)
        on update cascade
        on delete cascade,
    foreign key (steps_id) references steps (id)
        on update cascade
        on delete cascade
);