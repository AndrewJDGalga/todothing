create table if not exists task_list (
    id              integer primary key autoincrement,
    user_id         integer not null,
    name            text not null,
    due_date        datetime,
    repeat_when     integer,
    location        text,
    notes           text,
    created         datetime,
    foreign key (step_list_id) references step_list (id) 
        on update cascade 
        on delete cascade 
);