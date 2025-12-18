create trigger tasks_bool_guard
before insert on tasks
for each row
begin
    select case
        when new.isComplete <> 0 AND new.isComplete <> 1 then
            raise (abort, 'isComplete must be fake bool: 1 OR 0.')
    end;
end;

