import { CommonRoutesConfig } from '../common/common.route.config';
import AuthController from '../auth/controllers/auth.controller';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middlewar'
import { body } from 'express-validator';
import jwtMiddleware from '../auth/middleware/jwt.middleware';

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): express.Application {
        this.app.post(`/auth`, 
            body('email').isEmail(),
            body('password').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            AuthMiddleware.verifyUserPassword,
            AuthController.createJWT,
        );
        this.app.post(`/auth/refresh-token`, [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            AuthController.createJWT,
        ]);
        
        return this.app;
    }
}