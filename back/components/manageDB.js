import Database from "better-sqlite3";

////TODODODODODODO replace all the error handling

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

function createUserTable(db){
    let res = null;
    try {
        const createUserTable = db.prepare(`
            create table user (
                id integer primary key autoincrement,
                name text not null,
                password text not null,
                creation datetime not null,
                modification datetime not null
            )`
        );
        res = createUserTable.run();
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return res;
}

const db = dbConnection();
console.log(createUserTable(db));
//console.log(newUser(db, {name: "test", password: "t3st"}));