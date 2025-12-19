import assert from 'assert';
import { dbConnection, dbInit, getStepByID, removeStepByID, updateStepByID, addUser, changeUserName, changeUserPassword, removeUser, getAllDeleted, getUserCreationByID, getUserModificationsByID, addUserTask, addTaskStep } from '../components/vueTodoSQLDB.js';

console.log('dbInit');
dbInit();

describe('Database', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('User Table and Tracking', ()=>{
    const db = dbConnection();

    it('Add user', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.notStrictEqual(res, false);
    });
    it('Add user recorded', ()=>{
        const res = getUserCreationByID(db, 1);
        assert.notStrictEqual(res, false);
    });
    it('Add duplicate user name', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.strictEqual(res, 'duplicateName');
    });
    it('Change username and record', ()=>{
        changeUserName(db, 1, "charlie");
        const change = getUserModificationsByID(db, 1);
        assert.strictEqual(change[0].changed, 'name');
    });
    it('Change password and record', ()=>{
        changeUserPassword(db, 1, "test22!");
        const change = getUserModificationsByID(db, 1);
        assert.strictEqual(change[1].changed, 'password');
    });
    it('Deleted user accounts', ()=>{
        removeUser(db,1);
        const removed = getAllDeleted(db);
        assert.notStrictEqual(removed, false);
    });
});

describe('User Tasks Table', ()=>{
    const db = dbConnection();

    it('Add user task', ()=>{
        const userRes = addUser(db, 'userTask', 't35t');
        const userTaskRes = addUserTask(db, userRes.lastInsertRowid, 'complete task test');
        assert.notStrictEqual(userTaskRes, false);
    });
});

describe('Tasks Steps Table', ()=>{
    const db = dbConnection();

    it('Add tasks step', ()=>{
        const task = addTask(db, 'testing');
        const res = addTaskStep(db, task.lastInsertRowid, 'someStep');
        assert.notStrictEqual(res, false);
    });
});

describe('Step Table', ()=>{
    const db = dbConnection();

    it('Get step', ()=>{
        const res = getStepByID(db, 1);
        assert.notStrictEqual(res, false);
    });
    it('Update step', ()=>{
        const res = updateStepByID(db, 1, '90min');
        assert.notStrictEqual(res, false);
    });
    it('Remove step', ()=>{
        const res = removeStepByID(db, 1);
        assert.notStrictEqual(res, false);
    });
});

