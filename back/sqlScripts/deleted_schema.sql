create table if not exists deletion {
    id          integer primary key autoincrement,
    iso_date    text    not null,
    note        text    not null
};