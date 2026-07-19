import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(),"database","identities.json");

if(!fs.existsSync(DB_PATH)){
  fs.writeFileSync(DB_PATH, JSON.stringify([],null,2));
}

export function saveIdentity(data){
  const list = JSON.parse(fs.readFileSync(DB_PATH));
  
  const index = list.findIndex(
    x => x.wallet.toLowerCase() === data.wallet.toLowerCase()
  );

  if(index >= 0){
    list[index] = {
      ...list[index],
      ...data,
      updatedAt:new Date()
    };
  }else{
    list.push({
      ...data,
      createdAt:new Date()
    });
  }

  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(list,null,2)
  );

  return data;
}

export function getIdentity(wallet){
  const list = JSON.parse(fs.readFileSync(DB_PATH));

  return list.find(
    x => x.wallet.toLowerCase() === wallet.toLowerCase()
  );
}
