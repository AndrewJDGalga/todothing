import assert from 'assert';
import { dbConnection, dbInit, addStep, getStepByID, removeStepByID, updateStepByID, addUser, changeUserName, getUserByID, getUserCreationByID } from '../components/vueTodoSQLDB.js';

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
    /*
    it('Three created', ()=>{
        const res1 = addUser(db, 'test1', 't35t');
        const res2 = addUser(db, 'test1', 't35t');
    })
        */
});