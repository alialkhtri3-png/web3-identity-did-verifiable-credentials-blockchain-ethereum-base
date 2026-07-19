export function adminAuth(req,res,next){

    // يجب أن يكون gateway قد أنشأ req.tenant
    if(!req.tenant){

        return res.status(401).json({
            error:"Tenant required"
        });

    }

    req.user = {

        tenantId : req.tenant.tenantId,

        apiKey : req.tenant.apiKey,

        role : "OWNER"

    };

    next();

}
