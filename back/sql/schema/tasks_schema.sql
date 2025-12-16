create table if not exists tasks (
    id              integer primary key autoincrement,
    name            text not null,
    due_date        datetime,
    repeat_freq     integer,
    location        text,
    notes           text
);