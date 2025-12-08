import { access, constants } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

export default async function dbExist() {
    const location = 'db/todo.db';
    
    const db = new DatabaseSync(location);

}
dbExist();