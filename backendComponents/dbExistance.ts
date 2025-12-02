import { DatabaseSync } from "node:sqlite";

/*
    For the purpose of simplicity, a simple function that checks to confirm the required DB exists and all tables are present.
*/
export default async function dbExistance() {
    try {
        const info = await Deno.lstat('db/todo.db');
        if(!info.isFile){
            dbCreate();
        }
    }catch(e){
        if(!(e instanceof Deno.errors.NotFound)){
            throw e;
        }
        dbCreate();
    }
}

function dbCreate() {

}