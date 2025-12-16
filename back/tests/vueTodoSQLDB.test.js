import assert from 'assert';
import { dbConnection, dbInit, addStep, getStepByID, removeStepByID, updateStepByID, addUser, changeUserName, getUserByID } from '../components/vueTodoSQLDB.js';

console.log('dbInit');
dbInit();

describe('Database Behavior', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('Step Table Behavior', ()=>{
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

describe('User Table Behavior', ()=>{
    const db = dbConnection();

    it('Add user', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.notStrictEqual(res, false);
    });
    it('Add duplicate user name', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.strictEqual(res, 'duplicateName');
    });
    it('Update user modification', ()=>{
        addUser(db, 'test2', 't35t');
        const getRes1 = getUserByID(db, 2);
        changeUserName(db, 2, 'charlie');
        const getRes2 = getUserByID(db, 2);
        assert.notStrictEqual(getRes1[0].modification, getRes2[0].modification);
    });
});