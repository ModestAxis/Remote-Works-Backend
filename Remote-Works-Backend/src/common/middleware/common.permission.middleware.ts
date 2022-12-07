import express from 'express';
import { PermissionFlag } from './common.permissionflag.enum';
import debug from 'debug';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class PermissionMiddleware {

    permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const userPermissionFlags = parseInt(
                    res.locals.jwt.permissionFlags
                );
                if( userPermissionFlags & requiredPermissionFlag) {
                    next();
                }
                else {
                    res.status(403).send();
                }
            } catch (e) {
                log(e);
            }
        }
    }

    async sameUserOrAdmin(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
        if (
            //here we check agaisnt the userid requested and the one logged in
            //we dont need to check against permission
            //this will be used for user to edit and consult their profile
            //this will be used for company account to edit their profile and post/edit their adds
            (req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId) ||
            (req.params &&
            req.params.businessId &&
            req.params.businessId === res.locals.jwt.userId)
        ) {
            return next();
        } else {

            //here we will check if user is an admin
            if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send("thrown in same User or Admin");
            }

        }
    }
}

export default new PermissionMiddleware();