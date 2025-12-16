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

//STEPS TABLE--------------------------------------------------------

function createStepListTable(db){
    runRawSQL(db, './sql/schema/steps_schema.sql');
}

/**
 * Add row to steps
 * @access public
 * @param {Database} db 
 * @param {string} step 
 * @returns {(Object | boolean)}
 */
function addStep(db, step){
    let res = false;
    try{
        const addStepStmt = db.prepare(`
            insert into steps (step)
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
    return getRowByID(db, 'steps', id);
}
//Wrapper for updateCellByID
function updateStepByID(db, id, step){
    updateCellByID(db, 'steps', id, 'step', step);
}
//Wrapper for removeRowByID
function removeStepByID(db, id){
    return removeRowByID(db, 'steps', id);
}


//USERS TABLE--------------------------------------------------------

function createUserTable(db){
    runRawSQL(db, './sql/schema/users_schema.sql');
    runRawSQL(db, './sql/users_triggers.sql');
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
            insert into users (name, password, creation, modification) 
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
    return removeRowByID(db, 'users', id);
}
//wrapper for getUserByID
function getUserByID(db, id){
    return getRowByID(db, 'users', id);
}
//Wrapper for updateCellByID
function changeUserName(db, id, name){
    return updateCellByID(db, 'users', id, 'name', name);
}
//Wrapper for updateCellByID
function changeUserPassword(db, id, password){
    return updateCellByID(db, 'users', id, 'password', password);
}

