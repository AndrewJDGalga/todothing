import Database from "better-sqlite3";

////TODODODODODODO replace all the error handling


class SqliteDB {
    #dbConnection;

    constructor(location){
        this.location = location;
        this.#clearConnection();
    }

    #clearConnection(){
        if(this.#dbConnection) this.#dbConnection.close();
        this.#dbConnection = null;
    }
    #newDBConnection(){
        try {
            this.#dbConnection = new Database(this.location, {verbose: console.log});
        } catch(e) {
            console.log(e);
            process.exit(1);
        }
    }
    addUser({name, password}){
        this.#newDBConnection();
        const addUserStmt = this.#dbConnection.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
        const res = addUserStmt.run(name, password);
        this.#clearConnection();
        return res;
    }
    //never, ever return password
    getUser({id = null, name = null}){
        let res = {};
        if(id !== null) {
            res = this.#getUserByID(id);
        }else if(name !== null){
            res = this.#getUserByName(name);
        }
        return res;
    }
    #getUserByID(id){
        this.#newDBConnection();
        const findUserStmt = this.#dbConnection.prepare('select * from user where id = ?');
        const res = findUserStmt.all(id);
        this.#clearConnection();
        return res;
    }
    #getUserByName(name){
        this.#newDBConnection();
        const findUserStmt = this.#dbConnection.prepare('select * from user where name = ?');
        const res = findUserStmt.all(name);
        this.#clearConnection();
        return res;
    }
}
    
/*
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
}*/

/*
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
*/

const db = new SqliteDB('../db/todo.db');
//console.log(db.addUser({name: 'test1', password: "t3st"}));
console.log(db.getUser({name:'test1'}));

//let db = dbConnection();
//console.log(createUserTable(db));
//console.log(newUser(db, {name: "test", password: "t3st"}));
/*
console.log(db.close());
db = null;
db = dbConnection();
console.log(db.close());
*/