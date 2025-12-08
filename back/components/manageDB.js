import Database from "better-sqlite3";

function dbConnection() {
    const location = '../db/todo.db';
    let db = null;
    try {
        db = new Database(location);
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return db;
}
const db = dbConnection();