import Database from "better-sqlite3";

export default function dbExist() {
    const location = '../db/todo.db';
    
    const db = new Database(location);

}
dbExist();