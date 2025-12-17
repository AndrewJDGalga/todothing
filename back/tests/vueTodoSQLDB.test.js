import assert from 'assert';
import { dbConnection, dbInit, addStep, getStepByID, removeStepByID, updateStepByID, addUser, changeUserName, changeUserPassword, getUserByID, getUserCreationByID, getUserModificationsByID } from '../components/vueTodoSQLDB.js';

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
        const res = changeUserName(db, 1, "charlie");
        const change = getUserModificationsByID(db, 1);
        assert.strictEqual(change[0], 'name');
    });
    if('Change password and record', ()=>{
        const res = changeUserPassword(db, 1, "test22!");
        const change = getUserModificationsByID(db, 1);
        assert.strictEqual(change[1], 'password');
    });
});