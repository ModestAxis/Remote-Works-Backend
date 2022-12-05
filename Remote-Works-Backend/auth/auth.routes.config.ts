import { CommonRoutesConfig } from '../src/common/common.route.config';
import AuthController from './controllers/auth.controller';
import AuthMiddleware from './middleware/auth.middleware';
import express from 'express';
import BodyValidationMiddleware from '../src/common/middleware/body.validation.middlewar'
import { body } from 'express-validator';
import jwtMiddleware from './middleware/jwt.middleware';

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