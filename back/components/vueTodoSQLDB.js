import Database from "better-sqlite3";
import {readFile, readFileSync} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////---------------TODODODODODODO replace all the error handling


export { dbConnection, dbInit, getStepByID, removeStepByID, updateStepByID, addUser, removeUser, changeUserName, changeUserPassword, getUserByID, getAllDeleted, getUserCreationByID, getUserModificationsByID, addUserTask, addTaskStep, removeTask, getTaskByID, changeTaskName, changeTaskDueDate, changeTaskRepeatFreq, changeTaskLocation, changeTaskNotes, changeTaskIsComplete };



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
 * Convenience method to get everything setup without mistakes.
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
    id = forcePosInt(id);
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
    id = forcePosInt(id);
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
    id = forcePosInt(id);
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
/**
 * Confirm if string fits date formatting.
 * @param {string} someString 
 * @returns {boolean}
 */
function isISO8601Date(someString){
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/;
    return re.test(someString);
}
/**
 * Ensure number is 0+ int
 * @param {number} someNum 
 * @returns {number}
 */
function forcePosInt(someNum){
    if(someNum < 0) someNum = 0;
    return Math.round(someNum);
}

//CREATED TABLE--------------------------------------------------------
/**
 * Operations to create created table
 * @access private
 * @param {Database} db 
 */
function createCreatedTable(db){
    runRawSQL(db, './sql/schema/created_schema.sql');
}


//MODIFIED TABLE--------------------------------------------------------
/**
 * Operations to create modified table
 * @access private
 * @param {Database} db 
 */
function createModifiedTable(db){
    runRawSQL(db, './sql/schema/modified_schema.sql');
}


//DELETED TABLE--------------------------------------------------------
/**
 * Operations to create deleted table
 * @access private
 * @param {Database} db 
 */
function createDeletedTable(db){
    runRawSQL(db, './sql/schema/deleted_schema.sql');
}


//STEPS TABLE--------------------------------------------------------
/**
 * Operations to create Steps table
 * @access private
 * @param {Database} db 
 */
function createStepsTable(db){
    runRawSQL(db, './sql/schema/steps_schema.sql');
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
 * @access private
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
 * @access private
 * @param {Database} db 
 */
function createUsersCreatedTable(db){
    runRawSQL(db, './sql/schema/users_created_schema.sql');
}
/**
 * Get user account creation date by ID
 * @access public
 * @param {Database} db 
 * @param {number} id 
 * @returns {(Object | boolean)}
 */
function getUserCreationByID(db, id){
    let res = false;
    id = forcePosInt(id);
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
 * @access private
 * @param {Database} db 
 */
function createUsersModifiedTable(db){
    runRawSQL(db, './sql/schema/users_modified_schema.sql');
}
/**
 * Get all modifications for 1 user
 * @access public
 * @param {Database} db 
 * @param {number} id 
 * @returns {(Array | boolean)}
 */
function getUserModificationsByID(db, id){
    let res = false;
    id = forcePosInt(id);
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
 * @access private
 * @param {Database} db 
 */
function createUsersDeletedTable(db){
    runRawSQL(db, './sql/schema/users_deleted_schema.sql');
}
/**
 * Get all references to deleted accounts
 * @access public
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
 * @access private
 * @param {Database} db 
 */
function createTasksTable(db){
    runRawSQL(db, './sql/schema/tasks_schema.sql');
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
 * Expects isISO8601Date format.
 * @access private
 * @param {Database} db 
 * @param {number} id 
 * @param {string} dueDate 
 * @returns {(Object | boolean)}
 */
function changeTaskDueDate(db, id, dueDate){
    if(!isISO8601Date(dueDate)) return false; //short circut, bad practice?
    return updateCellByID(db, 'tasks', id, 'due_date', dueDate);
}
/**
 * Repeat frequency cannot be < 0 or decimal.
 * @access public
 * @param {Database} db 
 * @param {number} id 
 * @param {number} repeatFreq 
 * @returns {(Object | boolean)}
 */
function changeTaskRepeatFreq(db, id, repeatFreq){
    repeatFreq = forcePosInt(repeatFreq);
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
 * @access public
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
 * @access private
 * @param {Database} db 
 */
function createTasksStepsTable(db){
    runRawSQL(db, './sql/schema/tasks_steps_schema.sql');
}
/**
 * @access public
 * @param {Database} db 
 * @param {number} taskID 
 * @param {string} stepName 
 * @returns {(Object | boolean)}
 */
function addTaskStep(db, taskID, stepName){
    let res = false;
    taskID = forcePosInt(taskID);

    const stepInsertStmt = db.prepare(`
        insert into steps (step)
            values(?)
    `);
    const taskStepInsertStmt = db.prepare(`
        insert into tasks_steps (tasks_id, steps_id)
            values(?,?)
    `);
    const taskStepTransaction = db.transaction((taskID, stepName)=>{
        const stepResult = stepInsertStmt.run(stepName);
        const newStepID = stepResult.lastInsertRowid;
        return taskStepInsertStmt.run(taskID, newStepID);
    });

    try {
        res = taskStepTransaction(taskID, stepName);
    }catch(e){
        console.error('addTaskStep error:', e);
    }
    return res;
}


//USERS_TASKS TABLE--------------------------------------------------------
/**
 * Operations to create usersTasks table
 * @access private
 * @param {Database} db 
 */
function createUsersTasksTable(db){
    runRawSQL(db, './sql/schema/users_tasks_schema.sql');
}
/**
 * Tasks should be tied to user. JS-approach over pure SQL for simplier transaction (imo).
 * @access public
 * @param {Database} db 
 * @param {number} userID 
 * @param {string} name 
 * @param {string} due_date 
 * @param {number} repeat_freq 
 * @param {string} location 
 * @param {string} notes 
 * @returns {(Object | boolean)}
 */
function addUserTask(db, userID, taskName, due_date=null, repeat_freq=0, location=null, notes=null){
    let res = false;
    userID = forcePosInt(userID);
    repeat_freq = forcePosInt(repeat_freq);

    const taskInsertStmt = db.prepare(`
        insert into tasks (name, due_date, repeat_freq, location, notes)
            values(?,?,?,?,?)
    `);
    const userTaskInsertStmt = db.prepare(`
        insert into users_tasks (users_id, tasks_id)
            values(?,?)
    `);
    const userTaskTransaction = db.transaction((userID, name, due_date, repeat_freq, location, notes)=>{
        const taskResult = taskInsertStmt.run(name, due_date, repeat_freq, location, notes);
        const newTaskID = taskResult.lastInsertRowid;
        return userTaskInsertStmt.run(userID, newTaskID);
    });

    try {
        res = userTaskTransaction(userID, taskName, due_date, repeat_freq, location, notes);
    }catch(e){
        console.error('createUserTask error:', e);
    }
    return res;
}


//TRIGGERS--------------------------------------------------------
/**
 * Operations to create users triggers. Run after tables.
 * @access private
 * @param {Database} db 
 */
function createUsersTriggers(db){
    runRawSQL(db, './sql/users_triggers.sql');
}
/**
 * Init tasks table triggers, run after tables created.
 * @access private
 * @param {Database} db 
 */
function createTasksTriggers(db){
    runRawSQL(db, './sql/tasks_triggers.sql');
}