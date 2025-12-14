import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////---------------TODODODODODODO replace all the error handling


export { dbConnection, runRawSQL, addStep, getStepByID, removeStepByID, addUser };

//DATABASE--------------------------------------------------------
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
 * @param {string} tableName 
 * @param {number} id 
 * @returns {(Array | string | boolean)}
 */
function getRowByID(db, tableName, id){
    let res = false;
    try {
        const getRowStmt = db.prepare(`
            select * from ${tableName} where id = ?
        `);
        res = getRowStmt.all(id);    
    } catch (error) {
        console.error('getRowByID error:', e);
    }
    return res;
}
/**
 * 
 * @param {Database} db 
 * @param {string} tableName 
 * @param {number} id 
 * @returns {(Object | string | boolean)}
 */
function removeRowByID(db, tableName, id){
    let res = false;
    try {
        const removeRowStmt = db.prepare(`
            delete from ${tableName} where id = ?
        `);
        res = removeRowStmt.run(id);
    }catch{
        console.error('removeRowByID error:', e);
    }
    return res;
}

//STEP_LIST TABLE--------------------------------------------------------
/**
 * Add row to step_list
 * @param {Database} db 
 * @param {string} step 
 * @returns {(Object | string | boolean)}
 */
function addStep(db, step){
    let res = false;
    try{
        const addStepStmt = db.prepare(`
            insert into step_list (step)
                values (?)
        `);
        res = addStepStmt.run(step);
        console.log('addStep: insert result:', res);
    }catch(e){
        console.error('addStep error:', e);
    }
    return res;
}
//Wrapper for getRowByID
function getStepByID(db, id){
    return getRowByID(db, 'step_list', id);
}
//Wrapper for removeRowByID
function removeStepByID(db, id){
    return removeRowByID(db, 'step_list', id);
}


//USER TABLE--------------------------------------------------------
function addUser(db, {name, password}){
    let res = false;
    try{
        const addUserStmt = db.prepare(`
            insert into user (name, password, creation, modification) 
                values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        res = addUserStmt.run(name, password);
    }catch(e){
        if(e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            console.error('addUser error:', e);
            res = 'duplicateName';
        }
    }
    return res;
}
//wrapper for removeRowByID
function removeUser(db, id) {
    return removeRowByID(db, 'user', id);
}
//wrapper for getUserByID
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