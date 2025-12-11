create table if not exists user (
    id              integer primary key autoincrement,
    name            text not null,
    password        text not null,
    creation        datetime not null,
    modification    datetime not null
);