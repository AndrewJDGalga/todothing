import assert from 'assert';
import { addStep, getStepByID, dbConnection, runRawSQL, removeStepByID } from '../components/manageDB.js';

describe('Database Behavior', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('Step Table Behavior', ()=>{
    const db = dbConnection();
    runRawSQL(db, './sqlScripts/step_list_table.sql');

    it('Add step', ()=>{
        const res = addStep(db, '30min');
        assert.notStrictEqual(res, false);
        assert.notStrictEqual(res, '');
    });
    it('Get step', ()=>{
        const res = getStepByID(db, 1);
        assert.notStrictEqual(res, false);
        assert.notStrictEqual(res, '');
    });
    it('Remove step', ()=>{
        const res = removeStepByID(db, 1);
        assert.notStrictEqual(res, false);
        assert.notStrictEqual(res, '');
    });
});

