import initSqlJs from "sql.js";
import fs from "fs";

let db;

export async function getDB(){
  if(db) return db;

  const SQL = await initSqlJs();

  if(fs.existsSync("data/identity.db")){
    const file = fs.readFileSync("data/identity.db");
    db = new SQL.Database(file);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet TEXT UNIQUE,
      score INTEGER DEFAULT 0,
      createdAt TEXT
    )
  `);

  return db;
}

export function saveDB(){
  if(!db) return;
  const data = db.export();
  fs.writeFileSync("data/identity.db", Buffer.from(data));
}
