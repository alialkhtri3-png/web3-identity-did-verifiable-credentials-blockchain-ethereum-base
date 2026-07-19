import {
createToken
}
from "./jwt.js";


export function socialLogin({

id,
provider,
email

}){


if(!id || !provider || !email){

throw new Error(
"Missing social data"
);

}



const user={


id,

email,

provider,


role:"WEB3_USER",


createdAt:
Date.now()


};



const token =
createToken(user);



return {


user,


token


};



}
