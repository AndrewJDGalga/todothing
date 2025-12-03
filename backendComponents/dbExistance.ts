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
            const columns = [];
            let foreignKeys = {};

            for(const col in table){
                if(col === 'foreign_key') {
                    foreignKeys = {...table[col]};
                } else {
                    //const arr:Array<string> = table[col];
                    //console.log((table[col] as Array<string>).slice(0).join(' '));
                    if(!Array.isArray(table[col])) throw new Error('dbExistance.ts 58: Expect table[col] to be Array.');
                    columns.push(`${col} ${(table[col] as Array<string>).slice(0).join(' ')}`.trim());
                    //console.log(columns);
                }
                
                /*
                const colStructure = `${col} ${table[col]}`.replace(/,/, " ");
                sql += `${colStructure}, `;
                */
            }

            for(const col in foreignKeys){
                columns.push(`foreign key (${col}) references ${foreignKeys[col]} (${col})`);
            }

            sql += columns.join();
            console.log(sql);

            /*
            sql = sql.slice(0, -2);
            
            for(const col in foreignKeys){
                sql += ` foreign key (${foreignKeys[col]}) references ${col} (${foreignKeys[col]})`;
            }

            sql += 

            */
        }
    }catch(e){
        throw(e);
    }
}