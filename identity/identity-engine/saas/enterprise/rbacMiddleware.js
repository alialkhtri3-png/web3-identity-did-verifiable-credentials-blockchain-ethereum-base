import {
    hasPermission
}
from "./permissions.js";



export function requirePermission(permission){


    return (req,res,next)=>{


        const role =
        req.user?.role ||
        req.tenant?.role;



        if(!role){

            return res.status(403).json({

                error:"Missing Role"

            });

        }



        if(
            !hasPermission(
                role,
                permission
            )
        ){

            return res.status(403).json({

                error:"Permission Denied",

                required:permission

            });

        }



        next();


    };

}
