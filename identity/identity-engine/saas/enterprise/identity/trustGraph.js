import fs from "fs";

const FILE="./saas/enterprise/data/trust-graph.json";


function load(){

if(!fs.existsSync(FILE))
 return {nodes:[],edges:[]};

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


export function addTrustRelation(source,target,score){

const graph=load();

if(!graph.nodes.includes(source))
 graph.nodes.push(source);

if(!graph.nodes.includes(target))
 graph.nodes.push(target);


graph.edges.push({
 source,
 target,
 score:score || 0,
 createdAt:new Date().toISOString()
});


save(graph);

return graph;

}


export function getTrustGraph(){

return load();

}


export function calculateTrust(wallet){

const graph=load();

const links=graph.edges.filter(
 e=>e.source===wallet || e.target===wallet
);


const score=links.reduce(
 (sum,e)=>sum+e.score,
0);


return {
 wallet,
 connections:links.length,
 trustScore:score
};

}
