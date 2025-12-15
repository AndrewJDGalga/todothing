create table if not exists step_list (
    id          integer primary key autoincrement,
    task_list   integer not null,
    step        text not null
);