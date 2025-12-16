create trigger users_created_after
after insert on users
begin
    insert into created(iso_date)
        values(strftime('%Y-%m-%d %H:%M:%f', 'now'));
    insert into users_created(users_id, created_id)
        values(new.id, last_insert_rowid());
end; 

create trigger users_modified_after
after update on users
for each row
begin
    if new.name <> old.name then
        insert into modified(iso_date, changed) 
            values(strftime('%Y-%m-%d %H:%M:%f', 'now'), 'name');
        insert into users_modified(users_id, modified_id) 
            values(new.id, last_insert_rowid());
    end if;

    if new.password <> old.password then
        insert into modified(iso_date, changed) 
            values(strftime('%Y-%m-%d %H:%M:%f', 'now'), 'password');
        insert into users_modified(users_id, modified_id) 
            values(new.id, last_insert_rowid());
    end if;
end;

create trigger users_deleted_before
before delete on users
begin
    insert into deleted(iso_date, note)
        values(strftime('%Y-%m-%d %H:%M:%f', 'now'), old.name);
    insert into users_deleted(users_id, deleted_id)
        values(old.id, last_insert_rowid());
end;