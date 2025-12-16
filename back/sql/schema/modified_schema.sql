create table if not exists modified (
    id          integer primary key autoincrement,
    iso_date    text    not null,
    changed     text    not null
);