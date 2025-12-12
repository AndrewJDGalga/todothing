import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());

////---------------TODODODODODODO replace all the error handling

//DATABASE
const location = '../db/todo.db';
function dbConnection(location) {
    let db = null;
    try {
        //better-SQLite3 will create db file if not present
        db = new Database(location, {verbose: console.log});
        db.pragma('foreign_keys = on');
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return db;
}
//intentionally unsafe
function runRawSQL(db, scriptFilePath) {
    const rawCmd = readFileSync(scriptFilePath, 'utf8');
    db.exec(rawCmd);
}

//USER
function addUser(db, {name, password}){
    let res = '';
    try{
        const addUserStmt = db.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
        res = addUserStmt.run(name, password);
    }catch(e){
        console.log(Object.keys(e));
        console.log(e.code);
        if(e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            console.log('NOT UNIQUE!!!');
        }
    }
    return res;
    /*
    const addUserStmt = db.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    return addUserStmt.run(name, password);
    */
}
function removeUser(db, id) {
    const removeUserStmt = db.prepare('delete from user where id = ?');
    return removeUserStmt.run(id);
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
function confirmUser(db, {providedName, providedPassword}){
    const result = getUserByName(db, providedName);

}

//STEP_LIST


//TASK_LIST


//USER_TASK_LIST



//TEST
const db = dbConnection(location);
/*
console.log(runRawSQL(db, '../sqlScripts/step_list_table.sql'));
console.log(runRawSQL(db, '../sqlScripts/user_table.sql'));
console.log(runRawSQL(db, '../sqlScripts/task_list_table.sql'));
console.log(runRawSQL(db, '../sqlScripts/user_task_list_table.sql'));
*/
console.log(addUser(db, {name: 'test', password: 't35t'}));
console.log(getUserByName(db, 'test'));
//console.log(removeUser(db, 3));
//console.log(getUserByName(db, 'test'));
//console.log(getUserByName(db, 'test'));
//console.log(getUserByID(db, 1));

db.close();