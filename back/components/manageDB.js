import Database from "better-sqlite3";
import {readFile} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////TODODODODODODO replace all the error handling

/*
class SqliteDBConn {
    #dbConnection;

    constructor(){
        this.location = '../db/todo.db';
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
}
*/
/*
function SqliteDBTask(command, data){
    let res = {};
    try{
        const db = new Database('../db/todo.db', {verbose: console.log});
        const stmt = db.prepare(command);
        let res = stmt
        db.close();
    } catch(e) {
        console.log(e);
        process.exit(1);
    }
    return res;
}

class BaseTable {
    constructor(schemaLocation){
        this.schema = schemaLocation;
    }
}

class UserTable extends BaseTable {
    constructor(){
        this.super('../db/tableSchemas/user.json');
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
*/

//DATABASE
const location = '../db/todo.db';

function dbConnection(location) {
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

//db
function createStepListTable(db, schemaLocation){
    readFile(schemaLocation, (e, data)=>{
        if(e) {
            console.err(e);
            process.exit(1);
        }
        const decoded = JSON.parse(data);
        const keys = Object.keys(decoded);
        const command = `
            create table if not exists ${decoded.table_name} (
                ${keys[1]} ${decoded.id[0]} ${decoded.id[1]}, 
                ${keys[2]} ${decoded.step[0]}
            )`;
        db.exec(command);
    });
}
function createUserTable(db, schemaLocation){
    readFile(schemaLocation, (e, data)=>{
        if(e) {
            console.err(e);
            process.exit(1);
        }
        const decoded = JSON.parse(data);
        const keys = Object.keys(decoded);
        const command = `
            create table if not exists ${decoded.table_name} (
                ${keys[1]} ${decoded.id[0]} ${decoded.id[1]}, 
                ${keys[2]} ${decoded.name[0]} ${decoded.name[1]},
                ${keys[3]} ${decoded.password[0]} ${decoded.password[1]},
                ${keys[4]} ${decoded.creation[0]} ${decoded.creation[1]},
                ${keys[5]} ${decoded.modification[0]} ${decoded.modification[1]}
            )`;
        db.exec(command);
    });
}
function createTaskListTable(db, schemaLocation){
    readFile(schemaLocation, (e, data)=>{
        if(e) {
            console.error(e);
            process.exit(1);
        }
        const decoded = JSON.parse(data);
        const keys = Object.keys(decoded);
        const foriegn_key = Object.keys(decoded.foreign_key);
        const command = `
            create table if not exists ${decoded.table_name} (
                ${keys[1]} ${decoded.id[0]} ${decoded.id[1]}, 
                ${keys[2]} ${decoded.name[0]} ${decoded.name[1]},
                ${keys[3]} ${decoded.step_list_id[0]},
                ${keys[4]} ${decoded.due_date[0]},
                ${keys[5]} ${decoded.repeat_when[0]},
                ${keys[6]} ${decoded.location[0]},
                ${keys[7]} ${decoded.notes[0]},
                ${keys[8]} ${decoded.created[0]},
                foreign key (${keys[3]}) references ${foriegn_key[0]} (${decoded.foreign_key.step_list}) 
                    on update cascade 
                    on delete cascade
            )`;
        console.log(command);
        db.exec(command);
    });
}

const db = dbConnection(location);
//createStepListTable(db, '../tableSchemas/step_list.json');
createTaskListTable(db, '../tableSchemas/task_list.json');

function newUser(db, {name, password}){
    const addUserStmt = db.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    return addUserStmt.run(name, password);
}

function getUserByID(db, id){
    const findUserStmt = db.prepare('select * from user where id = ?');
    const res = findUserStmt.all(id);
    return res;
}
function getUserByName(db, name){
    const findUserStmt = db.prepare('select * from user where name = ?');
    const res = findUserStmt.all(name);
    return res;
}

//const db = new SqliteDB();
//console.log(db.addUser({name: 'test1', password: "t3st"}));
//console.log(db.getUser({name:'test1'}));

//let db = dbConnection();
//console.log(createUserTable(db));
//console.log(newUser(db, {name: "test", password: "t3st"}));
/*
console.log(db.close());
db = null;
db = dbConnection();
console.log(db.close());
*/
