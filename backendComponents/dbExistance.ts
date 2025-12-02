import { DatabaseSync } from "node:sqlite";

/*
    For the purpose of simplicity, a simple function that checks to confirm the required DB exists and all tables are present.
*/
export default async function dbExistance() {
    const location = 'db/todo.db';
    try {
        const info = await Deno.lstat(location);
        if(!info.isFile){
            dbCreate(location);
        }
    }catch(e){
        if(!(e instanceof Deno.errors.NotFound)){
            throw e;
        }
        dbCreate(location);
    }
}

function dbCreate(location:string) {
    const db = new DatabaseSync(location);
    
    db.exec(
        `create table if not exists user(
            id          integer     primary key not null,
            name        text        not null,
            password    text        not null,
            created     datetime    not null,
            modified    datetime    not null
        );`
    );
    
    db.close();
}