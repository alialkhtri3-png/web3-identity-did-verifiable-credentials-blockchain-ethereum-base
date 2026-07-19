import {
verifyToken
}
from "./jwt.js";


export function authMiddleware(
req,
res,
next
){


const header =
req.headers.authorization;


if(!header){

return res.status(401)
.json({
error:"No token"
});

}



const token =
header.replace(
"Bearer ",
""
);



try{


req.user =
verifyToken(token);


next();



}catch(e){


return res.status(401)
.json({
error:"Invalid token"
});


}


}
