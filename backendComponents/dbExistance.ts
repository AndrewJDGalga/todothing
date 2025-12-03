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
    //const db = new DatabaseSync(location);

    schemaCreate();
    /*
    db.exec(
        `create table if not exists user(
            id          integer     primary key not null,
            name        text        not null,
            password    text        not null,
            created     datetime    not null,
            modified    datetime    not null
        );`
    );
    */
    
    //db.close();
}

async function schemaCreate() {
    console.log("generating schema");
    try {
        const raw = await Deno.readTextFile('db/schema/todo.json');
        const schemaPrototype = JSON.parse(raw);

        for(const tableName in schemaPrototype) {
            const table = schemaPrototype[tableName];
            let sql = `create table ${tableName} (`;
            let foreignKeys = {};

            for(const col in table){
                if(col === 'foreign_key') {
                    foreignKeys = {...table[col]};
                    continue;
                    //console.log(foreignKeys);
                }
                const colStructure = `${col} ${table[col]}`.replace(/,/, " ");
                sql += `${colStructure}, `;
                //sql += `${col} `
                //console.log(`${col} ${table[col]}`.replace(/,/, " "));
            }
            
            sql = sql.slice(0, -2);
            console.log(sql);
        }
    }catch(e){
        throw(e);
    }
}