import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////---------------TODODODODODODO replace all the error handling


export { dbConnection, dbInit, addStep, getStepByID, removeStepByID, updateStepByID, addUser, removeUser, changeUserName, changeUserPassword, getUserByID, getAllDeleted, getUserCreationByID, getUserModificationsByID, addTask };



//DATABASE COMMON--------------------------------------------------------
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
        console.error(e);
        process.exit(1);
    }
    return db;
}
/**
 * Convience method to get everything setup without mistakes.
 */
function dbInit() {
    const db = dbConnection();
    createStepsTable(db);
    createCreatedTable(db);
    createModifiedTable(db);
    createDeletedTable(db);
    createUsersTable(db);
    createUsersCreatedTable(db);
    createUsersModifiedTable(db);
    createUsersDeletedTable(db);
    createUsersTriggers(db);
    createTasksTable(db);
    createTasksStepsTable(db);
    createUsersTasksTable(db);
    createTasksTriggers(db);
    db.close();
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

function isISO8601Date(someString){
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/;
    return re.test(someString);
}


//CREATED TABLE--------------------------------------------------------
/**
 * Operations to create created table
 * @param {Database} db 
 */
function createCreatedTable(db){
    runRawSQL(db, './sql/schema/created_schema.sql');
}


//MODIFIED TABLE--------------------------------------------------------
/**
 * Operations to create modified table
 * @param {Database} db 
 */
function createModifiedTable(db){
    runRawSQL(db, './sql/schema/modified_schema.sql');
}


//DELETED TABLE--------------------------------------------------------
/**
 * Operations to create deleted table
 * @param {Database} db 
 */
function createDeletedTable(db){
    runRawSQL(db, './sql/schema/deleted_schema.sql');
}


//STEPS TABLE--------------------------------------------------------
/**
 * Operations to create Steps table
 * @param {Database} db 
 */
function createStepsTable(db){
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
/**
 * Operations to create users table
 * @param {Database} db 
 */
function createUsersTable(db){
    runRawSQL(db, './sql/schema/users_schema.sql');

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
            insert into users (name, password) 
                values (?,?)
        `);
        res = addUserStmt.run(name, password);
    }catch(e){
        if(e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res = 'duplicateName';
        }
        console.error('addUser error:', e);
    }
    return res;
}
//wrapper for removeRowByID
function removeUser(db, id) {
    return removeRowByID(db, 'users', id);
}
//wrapper for getRowByID
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


//USERS CREATED TABLE--------------------------------------------------------
/**
 * Operations to create usersCreated table
 * @param {Database} db 
 */
function createUsersCreatedTable(db){
    runRawSQL(db, './sql/schema/users_created_schema.sql');
}
/**
 * Get user account creation date by ID
 * @param {Database} db 
 * @param {number} id 
 * @returns {(Object | boolean)}
 */
function getUserCreationByID(db, id){
    let res = false;
    try{
        const getCreationStmt = db.prepare(`
            select u.users_id, c.iso_date
                from users_created u
            join created c on u.created_id = c.id
            where u.users_id = ?;
        `);
        res = getCreationStmt.run(id);
    }catch(e){
        console.error('getUserCreationByID error:', e);
    }
    return res;
}


//USERS MODIFIED TABLE--------------------------------------------------------
/**
 * Operations to create usersModified table
 * @param {Database} db 
 */
function createUsersModifiedTable(db){
    runRawSQL(db, './sql/schema/users_modified_schema.sql');
}
/**
 * Get all modifications for 1 user
 * @param {Database} db 
 * @param {number} id 
 * @returns {(Array | boolean)}
 */
function getUserModificationsByID(db, id){
    let res = false;
    try{
        const getModificationStmt = db.prepare(`
            select u.users_id, m.iso_date, m.changed
                from users_modified u
            join modified m on u.modified_id = m.id
            where u.users_id = ?;
        `);
        res = getModificationStmt.all(id);
    }catch(e){
        console.error('getUserModificationsByID error:', e);
    }
    return res;
}


//USERS DELETED TABLE--------------------------------------------------------
/**
 * Operations to create usersDeleted table
 * @param {Database} db 
 */
function createUsersDeletedTable(db){
    runRawSQL(db, './sql/schema/users_deleted_schema.sql');
}
/**
 * Get all references to deleted accounts
 * @param {Database} db 
 * @returns {(Array | boolean)}
 */
function getAllDeleted(db){
    let res = false;
    try{
        const getDeletedStmt = db.prepare(`
            select u.users_id, d.iso_date, d.note
                from users_deleted u
            inner join deleted d on u.deleted_id = d.id;
        `);
        res = getDeletedStmt.all();
    }catch(e){
        console.error('getAllDeleted error:', e);
    }
    return res;
}


//TASKS TABLE--------------------------------------------------------
/**
 * Operations to create tasks table
 * @param {Database} db 
 */
function createTasksTable(db){
    runRawSQL(db, './sql/schema/tasks_schema.sql');
}

/**
 * Expects ISO 8601 date
 * @param {Database} db 
 * @param {string} name 
 * @param {string} due_date 
 * @param {number} repeat_freq 
 * @param {string} location 
 * @param {string} notes 
 * @returns 
 */
function addTask(db, name, due_date=null, repeat_freq=null, location=null, notes=null){
    let res = false;
    try{
        const addTaskStmt = db.prepare(`
            insert into tasks (name, due_date, repeat_freq, location, notes) 
                values (?,?,?,?,?)
        `);
        res = addTaskStmt.run(name, due_date, repeat_freq, location, notes);
    }catch(e){
        console.error('addTask error:', e);
    }
    return res;
}

//wrapper for removeRowByID
function removeTask(db, id) {
    return removeRowByID(db, 'tasks', id);
}
//wrapper for getRowByID
function getTaskByID(db, id){
    return getRowByID(db, 'tasks', id);
}
//Wrapper for updateCellByID
function changeTaskName(db, id, name){
    return updateCellByID(db, 'tasks', id, 'name', name);
}

/**
 * Expects isISO8601Date format
 * @param {Database} db 
 * @param {number} id 
 * @param {string} dueDate 
 * @returns {(Object | boolean)}
 */
function changeTaskDueDate(db, id, dueDate){
    if(!isISO8601Date(dueDate)) return false; //short circut, bad practice?
    return updateCellByID(db, 'tasks', id, 'due_date', dueDate);
}
//Wrapper for updateCellByID
function changeTaskRepeatFreq(db, id, repeatFreq){
    return updateCellByID(db, 'tasks', id, 'repeat_freq', repeatFreq);
}
//Wrapper for updateCellByID
function changeTaskLocation(db, id, location){
    return updateCellByID(db, 'tasks', id, 'location', location);
}
//Wrapper for updateCellByID
function changeTaskNotes(db, id, notes){
    return updateCellByID(db, 'tasks', id, 'notes', notes);
}
/**
 * Complexity: isComplete is bool, but SQLite doesn't have this type. Must guard.
 * @param {Database} db 
 * @param {number} id 
 * @param {(number | boolean)} isComplete 
 * @returns {(Object | boolean)}
 */
function changeTaskIsComplete(db, id, isComplete){
    if(typeof isComplete === 'boolean') isComplete = (isComplete === false) ? 0 : 1;
    else if((isComplete !== 0) || (isComplete !== 1)) isComplete == 0;
    return updateCellByID(db, 'tasks', id, 'password', isComplete);
}


//TASKS_STEPS TABLE--------------------------------------------------------
/**
 * Operations to create tasksSteps table
 * @param {Database} db 
 */
function createTasksStepsTable(db){
    runRawSQL(db, './sql/schema/tasks_steps_schema.sql');
}


//USERS_TASKS TABLE--------------------------------------------------------
/**
 * Operations to create usersTasks table
 * @param {Database} db 
 */
function createUsersTasksTable(db){
    runRawSQL(db, './sql/schema/users_tasks_schema.sql');
}


//TRIGGERS--------------------------------------------------------
/**
 * Operations to create users triggers. Run after tables.
 * @param {Database} db 
 */
function createUsersTriggers(db){
    runRawSQL(db, './sql/users_triggers.sql');
}

function createTasksTriggers(db){
    runRawSQL(db, './sql/tasks_triggers.sql');
}