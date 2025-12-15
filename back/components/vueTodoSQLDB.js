import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////---------------TODODODODODODO replace all the error handling


export { dbConnection, createStepListTable, addStep, getStepByID, removeStepByID, updateStepByID, createUserTable, addUser, removeUser, changeUserName, getUserByID };



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
 * Particularly UNSAFE - Run raw SQL from scripts
 * @access private
 * @param {Database} db 
 * @param {string} scriptFilePath 
 */
function runRawSQL(db, scriptFilePath) {
    const rawCmd = readFileSync(scriptFilePath, 'utf8');
    db.exec(rawCmd);
}
/**
 * Retrieve table row by by ID (doesn't apply to all)
 * @access private
 * @param {Database} db 
 * @param {string} tableName 
 * @param {number} id 
 * @returns {(Array | boolean)}
 */
function getRowByID(db, tableName, id){
    let res = false;
    try {
        const getRowStmt = db.prepare(`
            select * from ${tableName} where id = ?
        `);
        res = getRowStmt.all(id);    
    } catch(e) {
        console.error('getRowByID error:', e);
    }
    return res;
}
/**
 * Remove table row by ID (doesn't apply to all)
 * @access private
 * @param {Database} db 
 * @param {string} tableName 
 * @param {number} id 
 * @returns {(Object | boolean)}
 */
function removeRowByID(db, tableName, id){
    let res = false;
    try {
        const removeRowStmt = db.prepare(`
            delete from ${tableName} where id = ?
        `);
        res = removeRowStmt.run(id);
    }catch(e){
        console.error('removeRowByID error:', e);
    }
    return res;
}
/**
 * Update 1 cell (by column) in 1 row.
 * @access private
 * @param {Database} db 
 * @param {string} tablename 
 * @param {number} id 
 * @param {string} colName 
 * @param {any} content
 * @returns {(Object | boolean)}
 */
function updateCellByID(db, tablename, id, colName, content){
    let res = false;
    try {
        const updateOneStmt = db.prepare(`
            update ${tablename}
            set ${colName} = ?
            where
                id = ?
        `);
        return updateOneStmt.run(content, id);
    } catch (e) {
        console.error('updateSingleByID:', e)
    }
    return res;
}

//STEP_LIST TABLE--------------------------------------------------------

function createStepListTable(db){
    runRawSQL(db, './sqlScripts/step_list_table.sql');
}

/**
 * Add row to step_list
 * @access public
 * @param {Database} db 
 * @param {string} step 
 * @returns {(Object | boolean)}
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
//Wrapper for updateCellByID
function updateStepByID(db, id, step){
    updateCellByID(db, 'step_list', id, 'step', step);
}
//Wrapper for removeRowByID
function removeStepByID(db, id){
    return removeRowByID(db, 'step_list', id);
}


//USER TABLE--------------------------------------------------------

function createUserTable(db){
    runRawSQL(db, './sqlScripts/user_table.sql');
    runRawSQL(db, './sqlScripts/user_triggers.sql');
}

/**
 * addUser to SQL DB.
 * @access public
 * @param {Database} db 
 * @param {string} name
 * @param {string} password
 * @returns {(Object | boolean | string)}
 */
function addUser(db, name, password){
    let res = false;
    try{
        const addUserStmt = db.prepare(`
            insert into user (name, password, creation, modification) 
                values (?,?, CURRENT_TIMESTAMP, strftime('%Y-%m-%d %H:%M:%f', 'now'))
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
//Wrapper for updateCellByID
function changeUserName(db, id, name){
    return updateCellByID(db, 'user', id, 'name', name);
}
//Wrapper for updateCellByID
function changeUserPassword(db, id, password){
    return updateCellByID(db, 'user', id, 'password', password);
}


//TASK LIST TABLE--------------------------------------------------------
function addTask(db, name, dueDate, repeatWhen, location, notes){
    let res = false;
    
    try {
        
        const addTaskStmt = db.prepare(`
            insert into task_list (name, step_list_id, due_date, repeat_when, location, notes, created)
                values
                    (?,NULL,?,?,?,?, CURRENT_TIMESTAMP)
        `);
        res = addTaskStmt.run(name, dueDate, repeatWhen, location, notes);
    } catch(e) {
        console.error('addStep error:', e);
    }
    return res;
}


//USER TASK LIST TABLE--------------------------------------------------------



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