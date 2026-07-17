import fs from "fs";

const FILE =
"./saas/enterprise/data/graph.json";


function load(){

    if(!fs.existsSync(FILE))
        return [];

    return JSON.parse(
        fs.readFileSync(FILE,"utf8")
    );

}


function save(data){

    fs.writeFileSync(
        FILE,
        JSON.stringify(data,null,2)
    );

}


export function addGraphEdge(
    wallet,
    target
){

    const graph = load();

    graph.push({

        wallet,

        target,

        createdAt:
        new Date().toISOString()

    });


    save(graph);

}


export function getConnections(wallet){

    const graph = load();

    return graph.filter(
        x=>x.wallet===wallet
    );

}
