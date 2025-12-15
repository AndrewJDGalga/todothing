import assert from 'assert';
import { dbConnection, createStepListTable, addStep, getStepByID, removeStepByID, updateStepByID, createUserTable, addUser } from '../components/vueTodoSQLDB.js';

describe('Database Behavior', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('Step Table Behavior', ()=>{
    const db = dbConnection();
    createStepListTable(db);

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
    createUserTable(db);

    it('Add user', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.notStrictEqual(res, false);
    });
    it('Add duplicate user name', ()=>{
        const res = addUser(db, 'test', 't35t');
        assert.strictEqual(res, 'duplicateName');
    });
});