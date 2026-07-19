import "dotenv/config";
import fs from "fs";

async function main(){

 const buffer = fs.readFileSync("gap-artifact.json");

 const form = new FormData();

 form.append(
   "file",
   new Blob([buffer]),
   "gap-artifact.json"
 );

 const res = await fetch(
   "https://uploads.pinata.cloud/v3/files",
   {
    method:"POST",
    headers:{
      Authorization:`Bearer ${process.env.PINATA_JWT}`
    },
    body:form
   }
 );

 const text = await res.text();

 console.log(text);

 try{
   const out=JSON.parse(text);

   const cid =
    out.data?.cid ||
    out.cid;

   if(cid){

    const artifact =
      JSON.parse(
        fs.readFileSync(
          "gap-artifact.json",
          "utf8"
        )
      );

    artifact.storage={
      type:"IPFS",
      cid
    };

    fs.writeFileSync(
      "gap-artifact.json",
      JSON.stringify(artifact,null,2)
    );

    console.log("✅ IPFS CID:",cid);
   }

 }catch(e){
   console.log("Response parse error");
 }
}

main().catch(console.error);
