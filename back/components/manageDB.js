import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////---------------TODODODODODODO replace all the error handling


export { dbConnection, runRawSQL, addStep, getStepByID };

//DATABASE
/**
 * Get connection to SQlite3 DB, and creates if not present.
 * @access public
 * @returns {(Database | null)}
 */
function dbConnection() {
    const location = './db/todo.db';
    let db = null;
    try {
        db = new Database(location, {verbose: console.log});
        db.pragma('foreign_keys = on');
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    return db;
}
/**
 * UNSAFE - Run raw SQL from scripts
 * @access public
 * @param {Database} db 
 * @param {string} scriptFilePath 
 */
function runRawSQL(db, scriptFilePath) {
    const rawCmd = readFileSync(scriptFilePath, 'utf8');
    db.exec(rawCmd);
}
/**
 * Retrieve table row by by ID.
 * @access private
 * @param {Database} db 
 * @param {string} table 
 * @param {number} id 
 * @returns {(string | string | boolean)}
 */
function getRowByID(db, table, id){
    let res = '';
    try {
        const findUserStmt = db.prepare(`
            select * from ${table} where id = ?
        `);
        res = findUserStmt.all(id);    
    } catch (error) {
        console.error('getRowByID error:', e);
        res = false;
    }
    return res;
}

//STEP_LIST TABLE
function addStep(db, step){
    let res = '';
    try{
        const addStepStmt = db.prepare(`
            insert into step_list (step)
                values (?)
        `);
        res = addStepStmt.run(step);
        console.log('addStep: insert result:', res);
    }catch(e){
        console.error('addStep error:', e);
        res = false;
    }
    return res;
}
function getStepByID(db, id){
    return getRowByID(db, 'step_list', id);
}

//USER
function addUser(db, {name, password}){
    let res = '';
    try{
        const addUserStmt = db.prepare(`
            insert into user (name, password, creation, modification) 
                values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        res = addUserStmt.run(name, password);
    }catch(e){
        if(e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res = false;
        }else{
            console.error(e.code);
        }
    }
    return res;
}
function removeUser(db, id) {
    const removeUserStmt = db.prepare('delete from user where id = ?');
    return removeUserStmt.run(id);
}
function getUserByID(db, id){
    return getRowByID(db, 'user', id);
}
function getUserByName(db, name){
    const findUserStmt = db.prepare('select * from user where name = ?');
    return findUserStmt.all(name);
}
function changeUserName(db, id, name){
    const changeNameStmt = db.prepare(`
        update user 
        set name = ?
        where
            id = ?
        `);
    return changeNameStmt.run(name, id);
}
function changeUserPassword(db, id, password){
    const changePasswordStmt = db.prepare(`
        update user 
        set password = ?
        where
            id = ?
        `);
    return changePasswordStmt.run(password, id);
}



//TASK_LIST


//USER_TASK_LIST



//TEST
//const db = dbConnection();

//console.log(runRawSQL(db, './sqlScripts/step_list_table.sql'));
//console.log(runRawSQL(db, '../sqlScripts/user_table.sql'));
//console.log(runRawSQL(db, '../sqlScripts/task_list_table.sql'));
//console.log(runRawSQL(db, '../sqlScripts/user_task_list_table.sql'));

//console.log(addUser(db, {name: 'test', password: 't35t'}));
//console.log(addStep(db, '30min'));
//console.log(removeUser(db, 3));
//console.log(getUserByName(db, 'test'));
//console.log(getUserByName(db, 'test'));
//console.log(getUserByID(db, 1));

//db.close();