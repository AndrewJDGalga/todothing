import assert from 'assert';
import {dbConnection} from '../components/manageDB.js';

describe('Database Test', ()=>{
    it('Connect to Database', ()=>{
        assert.ok(dbConnection());
    })
    
});

