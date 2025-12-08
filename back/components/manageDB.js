import Database from "better-sqlite3";

function dbConnection() {
    const location = '../db/todo.db';
    let db = null;
    try {
        //better-SQLite3 will create db file if not present
        db = new Database(location);
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return db;
}

function newUser(db, {name, password}){
    const addUserStmt = db.prepare('insert into users (name, password) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    return addUserStmt.run([name, password]);
}

const db = dbConnection();
console.log(newUser(db, {name: "test", password: "t3st"}));