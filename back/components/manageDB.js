import Database from "better-sqlite3";
import {readFile} from "node:fs";

//I want to know when I last did something, getting distracted. --TODO remove
console.log("Timestamp: ", new Date(Date.now()).toLocaleTimeString());
////TODODODODODODO replace all the error handling

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

//USER
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
                ${keys[1]} ${decoded.id[0]} ${decoded.id[1]} ${decoded.id[2]}, 
                ${keys[2]} ${decoded.name[0]} ${decoded.name[1]},
                ${keys[3]} ${decoded.password[0]} ${decoded.password[1]},
                ${keys[4]} ${decoded.creation[0]} ${decoded.creation[1]},
                ${keys[5]} ${decoded.modification[0]} ${decoded.modification[1]}
            )`;
        console.log(command);
        db.exec(command);
    });
}
function addUser(db, {name, password}){
    const addUserStmt = db.prepare('insert into user (name, password, creation, modification) values (?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    return addUserStmt.run(name, password);
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
                ${keys[1]} ${decoded.step[0]}
            )`;
        console.log(command);
        db.exec(command);
    });
}

//TASK_LIST
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
                ${keys[1]} ${decoded.name[0]} ${decoded.name[1]},
                ${keys[2]} ${decoded.step_list_id[0]},
                ${keys[3]} ${decoded.due_date[0]},
                ${keys[4]} ${decoded.repeat_when[0]},
                ${keys[5]} ${decoded.location[0]},
                ${keys[6]} ${decoded.notes[0]},
                ${keys[7]} ${decoded.created[0]},
                foreign key (${keys[3]}) references ${foriegn_key[0]} (${decoded.foreign_key.step_list}) 
                    on update cascade 
                    on delete cascade
            )`;
        console.log(command);
        db.exec(command);
    });
}

//USER_TASK_LIST
function createUserTaskListTable(db, schemaLocation){
    readFile(schemaLocation, (e, data)=>{
        if(e) {
            console.err(e);
            process.exit(1);
        }
        const decoded = JSON.parse(data);
        const keys = Object.keys(decoded);
        const foriegn_key = Object.keys(decoded.foreign_key);
        const command = `
            create table if not exists ${decoded.table_name} (
                ${keys[1]} ${decoded.user_id[0]} ${decoded.user_id[1]},
                ${keys[2]} ${decoded.task_list_id[0]} ${decoded.task_list_id[1]},
                foreign key (${keys[1]}) references ${foriegn_key[0]} (${decoded.foreign_key.user}) 
                    on update cascade 
                    on delete cascade,
                foreign key (${keys[2]}) references ${foriegn_key[1]} (${decoded.foreign_key.task_list}) 
                    on update cascade 
                    on delete cascade
            )`;
        console.log(command);
        db.exec(command);
    });
}

const db = dbConnection(location);
//createStepListTable(db, '../tableSchemas/step_list.json');
//createUserTable(db, '../tableSchemas/user.json');
//createTaskListTable(db, '../tableSchemas/task_list.json');
//createUserTaskListTable(db, '../tableSchemas/user_task_list.json');

console.log(addUser(db, {name: 'test', password: 't35t'}));
console.log(getUserByName(db, 'test'));