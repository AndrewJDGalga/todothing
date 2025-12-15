create trigger user_details_modified
after update on user
when old.name <> new.name OR old.password <> new.password
begin
    update user
    set modification = CURRENT_TIMESTAMP
    where id = old.id;
end;