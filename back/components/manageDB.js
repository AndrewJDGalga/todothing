import Database from "better-sqlite3";

////TODODODODODODO replace all the error handling

/*
class sqliteDB {
    #dbConnection;
    constructor(location){
        this.location = location;
        this.#dbConnection = null;
    }

    #newDBConnection(){
        try {
            #dbConnection = new Database(location, {verbose: console.log});
        }
    }
}
    */

function dbConnection() {
    const location = '../db/todo.db';
    let db = null;
    try {
        //better-SQLite3 will create db file if not present
        db = new Database(location, {verbose: console.log});
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return db;
}

function newUser(db, {name, password}){
    const addUserStmt = db.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    return addUserStmt.run(name, password);
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

function createTable(db, schema) {
    
}

function getUser(id) {
    const selection = db.prepare('select * from user where id = ?');
    return selection.all(id);
}

let db = dbConnection();
//console.log(createUserTable(db));
//console.log(newUser(db, {name: "test", password: "t3st"}));
console.log(db.close());
db = null;
db = dbConnection();
console.log(db.close());