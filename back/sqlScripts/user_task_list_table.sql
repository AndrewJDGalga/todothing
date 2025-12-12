create table if not exists user_task_list (
    user_id         integer not null,
    task_list_id    integer not null,
    foreign key (user_id) references user (id)
        on update cascade
        on delete cascade,
    foreign key (task_list_id) references task_list (id)
        on update cascade
        on delete cascade
);