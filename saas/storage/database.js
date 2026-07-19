import fs from "fs";

const DB="./saas/storage/data.json";


function load(){

    if(!fs.existsSync(DB)){
        fs.writeFileSync(
            DB,
            JSON.stringify({})
        );
    }

    return JSON.parse(
        fs.readFileSync(DB,"utf8")
    );

}



function save(data){

    fs.writeFileSync(
        DB,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}



export function readCollection(name){

    const db=load();

    return db[name] || [];

}



export function writeCollection(
    name,
    data
){

    const db=load();

    db[name]=data;

    save(db);

}
