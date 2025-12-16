create trigger users_details_modified
after update on users
when old.name <> new.name OR old.password <> new.password
begin
    update users
    set modification = strftime('%Y-%m-%d %H:%M:%f', 'now')
    where id = old.id;
end;