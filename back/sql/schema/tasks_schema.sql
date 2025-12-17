create table if not exists tasks (
    id              integer primary key autoincrement,
    name            text not null,
    due_date        text,
    repeat_freq     integer,
    location        text,
    notes           text,
    isComplete      integer not null default 0 --treat as bool, 0 = false
);