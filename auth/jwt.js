import jwt from "jsonwebtoken";


const SECRET =
process.env.JWT_SECRET ||
"sovereign-engine-secret";


export function createToken(data){

return jwt.sign(
data,
SECRET,
{
expiresIn:"7d"
}
);


}



export function verifyToken(token){

return jwt.verify(
token,
SECRET
);

}
