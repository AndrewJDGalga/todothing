create table if not exists task_list (
    name text not null,
    step_list_id integer,
    due_date datetime,
    repeat_when integer,
    location text,
    notes text,
    created datetime,
    foreign key (step_list_id) references step_list (rowid) 
        on update cascade 
        on delete cascade 
);