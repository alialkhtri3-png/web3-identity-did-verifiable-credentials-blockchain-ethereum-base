import { getDB, saveDB } from "../../db.js";
import crypto from "crypto";

export async function createApiKey(owner){
  const db = await getDB();

  const key = crypto.randomBytes(32).toString("hex");

  db.run(`
    CREATE TABLE IF NOT EXISTS apiKeys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner TEXT UNIQUE,
      key TEXT,
      createdAt TEXT
    )
  `);

  db.run(
    "INSERT OR REPLACE INTO apiKeys(owner,key,createdAt) VALUES(?,?,?)",
    [
      owner,
      key,
      new Date().toISOString()
    ]
  );

  saveDB();

  return {
    owner,
    key
  };
}

export async function getApiKey(owner){
  const db = await getDB();

  const result = db.exec(
    "SELECT * FROM apiKeys WHERE owner=?",
    [owner]
  );

  if(!result.length) return null;

  return result[0].values[0];
}

export async function updateApiKey(owner,newKey){
  const db = await getDB();

  db.run(
    "UPDATE apiKeys SET key=? WHERE owner=?",
    [
      newKey,
      owner
    ]
  );

  saveDB();

  return true;
}

export async function verifyApiKey(key){
  const db = await getDB();

  const result = db.exec(
    "SELECT * FROM apiKeys WHERE key=?",
    [key]
  );

  if(!result.length) return false;

  return result[0].values.length > 0;
}
