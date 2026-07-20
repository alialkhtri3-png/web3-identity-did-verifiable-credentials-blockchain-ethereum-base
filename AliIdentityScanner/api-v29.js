const express=require("express");
const QRCode=require("qrcode");

const app=express();

const identities={

"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C":{
identity:"Verified Human Multi-chain",
reputation:95,
confidence:95,
risk:"LOW"
},

"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c":{
identity:"Active Wallet",
reputation:60,
confidence:90,
risk:"LOW"
}

};


app.get("/",(req,res)=>{

res.json({

engine:"AliAlkhtri Sovereign Identity Engine V29",

status:"ONLINE",

module:"QR Identity Passport + Public Profile"

});

});


app.get("/profile/:wallet",(req,res)=>{

let data=identities[req.params.wallet];

if(!data)
return res.status(404).json({
error:"identity not found"
});


res.send(`

<html>

<head>

<title>Sovereign Identity Passport</title>

<style>

body{
background:#0b0f19;
color:white;
font-family:Arial;
padding:30px;
}

.card{

background:#151b2b;
padding:25px;
border-radius:20px;

}

h1{
color:#4ade80;
}

</style>

</head>


<body>

<div class="card">

<h1>
AliAlkhtri Sovereign Identity Passport
</h1>

<p>DID:</p>

${"did:ethr:"+req.params.wallet}

<p>Identity:</p>

${data.identity}

<p>Reputation:</p>

${data.reputation}

<p>Confidence:</p>

${data.confidence}%

<p>Risk:</p>

${data.risk}

<br>

<img src="/qr/${req.params.wallet}" width="250">

</div>

</body>

</html>

`);

});


app.get("/qr/:wallet",async(req,res)=>{

let url=
"http://localhost:3000/profile/"+req.params.wallet;


let qr=await QRCode.toDataURL(url);


let img=Buffer.from(
qr.split(",")[1],
"base64"
);


res.type("png");

res.send(img);

});


app.listen(3000,()=>{

console.log(
"✅ V29 QR Identity Passport API running http://localhost:3000"
);

});

