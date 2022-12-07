import express from 'express';
import usersService from '../../users/services/users.service';
import businessService from '../../business/services/business.service';
import bcrypt from 'bcrypt';

class AuthMiddleware {

    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByEmailWithPassword(
            req.body.email
        );
        console.log(user.password)
        if (user) {
            const passwordHash = user.password;
            if (await bcrypt.compare(req.body.password , passwordHash)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionFlags: user.permissionFlags,
                };
                return next();
            }
        }
        // Giving the same message in both cases
        // helps protect against cracking attempts:
        res.status(400).send({ errors: ['Invalid email and/or password'] });
    }

    async verifyBusinessPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const business: any = await businessService.getBusinessByEmailWithPassword(
            req.body.email
        );
        console.log(business.password)
        if (business) {
            const passwordHash = business.password;
            if (await bcrypt.compare(req.body.password , passwordHash)) {
                req.body = {
                    userId: business._id,
                    email: business.email,
                    permissionFlags: business.permissionFlags,
                };
                return next();
            }
        }
        // Giving the same message in both cases
        // helps protect against cracking attempts:
        res.status(400).send({ errors: ['Invalid email and/or password'] });
    }
}

export default new AuthMiddleware(); 