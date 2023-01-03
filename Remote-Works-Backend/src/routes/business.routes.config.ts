import { CommonRoutesConfig } from '../common/common.route.config';
import BusinessController from '../business/controller/business.controller';
import BusinessMiddleware from '../business/middleware/business.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import PermissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middlewar';
import { body } from 'express-validator';
import businessMiddleware from '../business/middleware/business.middleware';

export class BusinessRoutes extends CommonRoutesConfig {
    
    constructor(app: express.Application) {
        super(app, 'BusinessRoutes')
    }

    configureRoutes(): express.Application {

        this.app
            //get to this routes return a list of all business (takes admin permission)
            //post creates a new business account and saves it to the DB (does not require any permission)
            .route('/business')
            .get(
                jwtMiddleware.validJWTNeeded,
                PermissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
                BusinessController.listBusiness
            )
            .post(
                body('email').isEmail(),
                body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                BusinessMiddleware.validateSameEmailDoesntExist,
                BusinessController.createBusiness
            );

        this.app.param('businessId', businessMiddleware.extractBusinessId);
        this.app
            .route(`/business/:businessId`)
            .all(
                BusinessMiddleware.validateBusinessExists,
                jwtMiddleware.validJWTNeeded,
                PermissionMiddleware.sameUserOrAdmin
            )
            .get(BusinessController.getBusinessById)
            .delete(BusinessController.removeBusiness);

        this.app.patch('/business/:businessId', [
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)').optional(),
            body('name').isString().optional(),
            body('website').isString().optional(),
            body('permissionFlags').isInt().optional(),
            BusinessMiddleware.validatePatchEmail,
            BusinessMiddleware.BusinessCantChangePermission,
            BusinessController.patch,
        ]);

        this.app.get(`/business/postings/:businessId`,
            BusinessMiddleware.validateBusinessExists,
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.sameUserOrAdmin,
            BusinessMiddleware.BusinessCantChangePermission,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_COMPANY),
            BusinessMiddleware.getBusinessPostings,
            BusinessController.sendBusinessPostings,
            )
        

        return this.app;
    }
}

