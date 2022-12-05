import express from 'express';
import usersService from '../../src/users/services/users.service';
import bcrypt from 'bcrypt';

class AuthMiddleware {

    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        console.log('in AuthMiddleware')
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
}

export default new AuthMiddleware(); 