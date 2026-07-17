import { trackUsage } from "./usageMeter.js";

export function usageMiddleware(req,res,next){

    // إذا لم يوجد Tenant فلا توقف الطلب
    if(!req.tenant){
        return next();
    }

    req.usage = trackUsage(
        req.tenant.tenantId
    );

    next();

}
