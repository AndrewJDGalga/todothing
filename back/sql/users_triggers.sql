create trigger users_created
after insert on users
begin

end; 

create trigger users_modified
after update on users
for each row
begin
    insert into modified(iso_date) 
        values(strftime('%Y-%m-%d %H:%M:%f', 'now'));

    insert into users_modified(users_id, modified_id) 
        values(new.id, last_insert_rowid());
end;

create trigger users_deleted
before delete on users
begin
end;