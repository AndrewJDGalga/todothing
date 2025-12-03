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
    schemaGenerateCommands('db/schema/todo.json').then(cmd=>dbSimpleCommand(cmd, location)).catch(e=>{
        console.error(e);
        Deno.exit(1);
    });
}

function dbSimpleCommand(cmd:string, location:string){
    const db = new DatabaseSync(location);
    db.exec(cmd);
    db.close();
}

async function schemaGenerateCommands(schemaLocation:string) : Promise<string> {
    let sql = '';
    try {
        const raw = await Deno.readTextFile(schemaLocation);
        const schemaPrototype = JSON.parse(raw);

        for(const tableName in schemaPrototype) {
            const table = schemaPrototype[tableName];
            sql += `create table ${tableName} (`;
            const columns = [];
            let foreignKeys:Record<string,string> = {};

            for(const col in table){
                if(col === 'foreign_key') {
                    foreignKeys = {...table[col]};
                } else {
                    if(!Array.isArray(table[col])) throw new Error('dbExistance.ts 58: Expect table[col] to be Array.');
                    columns.push(`${col} ${(table[col] as Array<string>).slice(0).join(' ')}`.trim());
                }
            }

            for(const col in foreignKeys){
                columns.push(`foreign key (${col}) references ${foreignKeys[col]} (${col})`);
            }

            sql += columns.join();
            sql += ');\n';
        }
    }catch(e){
        throw(e);
    }
    return sql;
}