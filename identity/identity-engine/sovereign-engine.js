import {
socialLogin
}
from "./auth/socialAuth.js";


import {
authMiddleware
}
from "./auth/middleware.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { ethers } from "ethers";

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());



/*
=========================
 EMAIL OTP AUTH
=========================
*/


const otpStore = new Map();


function createOTP(email){

    const otp =
    Math.floor(
    100000 +
    Math.random()*900000
    )
    .toString();


    otpStore.set(
        email,
        {
            otp,
            time:Date.now()
        }
    );


    return otp;
}



function verifyOTP(email,otp){

    const data =
    otpStore.get(email);


    if(!data)
    return false;


    if(Date.now()-data.time > 300000)
    return false;


    return data.otp===otp;

}



/*
=========================
 TOKEN ANALYZER
=========================
*/


const TRANSFER_TOPIC =
"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";



function decodeAddress(topic){

return "0x"+topic.slice(26);

}



function analyzeTokens(activity){


let transfers=[];


for(const item of activity){


if(
!item.log ||
item.log.topics[0]!==TRANSFER_TOPIC
)
continue;


const from =
decodeAddress(
item.log.topics[1]
);


const to =
decodeAddress(
item.log.topics[2]
);



const amount =
Number(
BigInt(item.log.data)
)
/
10**item.rawContract.decimals;



transfers.push({

type:"ERC20_TRANSFER",

asset:item.asset,

token:item.rawContract.address,

from,

to,

amount,

tx:item.hash


});


}


return transfers;

}



/*
=========================
 GRAPH ENGINE
=========================
*/


function buildGraph(transfers){


let edges=[];


for(const t of transfers){

edges.push({

source:t.from,

target:t.to,

asset:t.asset,

value:t.amount

});

}


return {

nodes:[
...new Set(
edges.flatMap(
e=>[
e.source,
e.target
]
)
)
],

edges

};

}



/*
=========================
 REPUTATION ENGINE
=========================
*/


function reputation(transfers){


let score=50;


let volume=0;


for(const t of transfers){

volume+=t.amount;

}


if(volume>10000)
score+=20;


if(volume>100000)
score+=20;



return {


score,

volume,


label:
score>80
?"High Activity"
:"Normal",


risk:
score<40
?"High"
:"Low"


};


}



/*// SOCIAL LOGIN

app.post(
"/auth/social/login",
(req,res)=>{


try{


const session =
socialLogin(
req.body
);



res.json({

success:true,

session


});



}catch(e){


res.status(400)
.json({

error:e.message

});


}



});



// PROTECTED IDENTITY TEST

app.get(
"/auth/profile",
authMiddleware,
(req,res)=>{


res.json({

authenticated:true,

user:req.user


});


});
=========================
 IDENTITY ENGINE
=========================
*/


function analyzeIdentity(data){



const tokens =
data.event?.activity
?
analyzeTokens(
data.event.activity
)
:
[];



const graph =
buildGraph(tokens);



const rep =
reputation(tokens);



return {


identity:{

id:
crypto.randomUUID(),

created:
new Date()

},


tokens,


graph,


reputation:rep


};


}




/*
=========================
 API
=========================
*/



app.get(
"/",
(req,res)=>{

res.json({

engine:
"Sovereign Identity Engine",

version:
"V7 Unified"

});


});





app.post(
"/auth/email/send",
(req,res)=>{


const {email}=req.body;


const otp =
createOTP(email);



console.log(
"OTP:",
otp
);


res.json({

sent:true

});


});





app.post(
"/auth/email/verify",
(req,res)=>{


const {
email,
otp
}=req.body;


res.json({

verified:
verifyOTP(
email,
otp
)

});


});





app.post(
"/api/analyze",
(req,res)=>{


const result =
analyzeIdentity(
req.body
);


res.json(result);


});





app.post(
"/webhook/alchemy",
(req,res)=>{


const report =
analyzeIdentity(
req.body
);



console.log(
JSON.stringify(
report,
null,
2
)
);



res.json({

received:true,

report

});


});





const PORT =
process.env.PORT || 3000;



app.listen(
PORT,
()=>{

console.log(
`
🚀 Sovereign Identity Engine V7 Running
http://localhost:${PORT}
`
);

});
