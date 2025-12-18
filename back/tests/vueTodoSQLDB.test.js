import assert from 'assert';
import { dbConnection, dbInit, addStep, getStepByID, removeStepByID, updateStepByID, addUser, changeUserName, changeUserPassword, removeUser, getAllDeleted, getUserCreationByID, getUserModificationsByID, addTask, addUserTask } from '../components/vueTodoSQLDB.js';

console.log('dbInit');
dbInit();

describe('Database', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('Step Table', ()=>{
    const db = dbConnection();

    it('Add step', ()=>{
        const res = addStep(db, '30min');
        assert.notStrictEqual(res, false);
    });
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

describe('Tasks Table', ()=>{
    const db = dbConnection();
    
    it('Add task empty', ()=>{
        const res = addTask(db, 'test');
        assert.notStrictEqual(res, false);
    });
    it('Add task filled', ()=>{
        const res = addTask(db, 'test', '2025-12-18T00:14:32.090Z', 2, 'blerghville of blog', 'test');
        assert.notStrictEqual(res, false);
    });
});

describe('User Tasks Table', ()=>{
    const db = dbConnection();

    it('Create user task', ()=>{
        const userRes = addUser(db, 'userTask', 't35t');
        const userTaskRes = addUserTask(db, userRes.lastInsertRowid, 'complete task test');
        assert.notStrictEqual(userTaskRes, false);
    });
});