import { CommonRoutesConfig } from '../common/common.route.config';
import UsersController from '../users/controller/users.controller';
import UsersMiddleware from '../users/middleware/users.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import PermissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middlewar';
import { body } from 'express-validator';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(
                jwtMiddleware.validJWTNeeded,
                PermissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
                UsersController.listUsers
                )
            .post(
                body('email').isEmail(),
                body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                PermissionMiddleware.sameUserOrAdmin
            )
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        //never use this use patch instead k thx
        this.app.put(`/users/:userId`, [
            body('email').isEmail(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)'),
            body('first_name').isString(),
            body('last_name').isString(),
            body('permissionFlags').isInt(),
            body('timezone').isString().optional(),
            body('country').isString().optional(),
            body('website').isString().optional(),
            body('git_url').isString().optional(),
            body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersMiddleware.userCantChangePermission,
            UsersController.put,
        ]);

        this.app.patch(`/users/:userId`, [
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)').optional(),
            body('first_name').isString().optional(),
            body('last_name').isString().optional(),
            body('timezone').isString().optional(),
            body('country').isString().optional(),
            body('website').isString().optional(),
            body('git_url').isString().optional(),
            body('permissionFlags').isInt().optional(),
            UsersMiddleware.validatePatchEmail,
            UsersMiddleware.userCantChangePermission,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_USER),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersController.patch,
            
        ]);

        this.app.patch(`/users/experiences/:userId`, [
            UsersMiddleware.validateUserExists,
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.sameUserOrAdmin,
            UsersMiddleware.userCantChangePermission,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_USER),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.pushExperienceToArray,
            UsersController.patch,
            
        ])

        this.app.patch(`/users/experiences/remove/:userId`, [
            UsersMiddleware.validateUserExists,
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.sameUserOrAdmin,
            UsersMiddleware.userCantChangePermission,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_USER),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.removeExperienceFromArray,
            UsersController.patch,
            
        ]);

        this.app.get(`/users/applications/:userId`,
            UsersMiddleware.validateUserExists,
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.sameUserOrAdmin,
            UsersMiddleware.userCantChangePermission,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_USER),
            UsersMiddleware.getUserApplication,
            UsersController.sendUserApplications,
            

        )


        return this.app;
    }
}