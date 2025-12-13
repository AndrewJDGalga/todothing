import assert from 'assert';
import { addStep, dbConnection, runRawSQL } from '../components/manageDB.js';

describe('Database Behavior', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    });
});

describe('Step Table Behavior', ()=>{
    const db = dbConnection();
    runRawSQL(db, './sqlScripts/step_list_table.sql');

    it('Add entry', ()=>{
        const res = addStep(db, '30min');
        assert.notStrictEqual(res, false);
        assert.notStrictEqual(res, '');
    });
});

