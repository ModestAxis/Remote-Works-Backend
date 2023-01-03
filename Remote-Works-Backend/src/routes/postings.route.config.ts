import { CommonRoutesConfig } from '../common/common.route.config';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import PermissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middlewar';
import { body } from 'express-validator';
import postingsController from '../postings/controller/postings.controller';
import postingsMiddleware from '../postings/middleware/postings.middleware';

export class PostingsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'PostingsRoutes');
    }

    configureRoutes(): express.Application {

        this.app
            .route(`/postings`)
            .get(
                postingsController.listPostings
            )
            .post(
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                postingsMiddleware.validatePostingsBodyFields,
                jwtMiddleware.validJWTNeeded,
                
                PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_COMPANY),
                //postingsMiddleware.validateOneJobTitlePerBusiness,
                postingsMiddleware.businessIdToBody,
                postingsMiddleware.businessNameToBody,
                postingsController.createPosting);

        this.app
            .route(`/postings/business/:businessId`)
            .get(
                postingsMiddleware.extractBusinessId,
                jwtMiddleware.validJWTNeeded,
                PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_COMPANY),
                postingsController.listBusinessPostings

            );

        this.app.param(`postingId`, postingsMiddleware.extractPostingsId);

        this.app
            .route(`/postings/:postingId`)
            .all(postingsMiddleware.validatePostingsExist)
            .get(postingsController.getPostingById);
        this.app.patch(`/postings/:postingId`, [
            //to implement:
            //verify BusinessId is same as Creator
            //Verify Business is logged in
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.sameUserOrAdmin,
            body('job_title').isString().optional(),
            body('timezone').isString().optional(),
            body('field').isString().optional(),
            body('country').isString().optional(),
            body('created_date').isDate().optional(),
            body('description').isString().optional(),
            body('salary').isString().optional(),
            body('start_date').isDate().optional(),
            body('isContract').isBoolean().optional(),
            body('contract_length_in_months').isInt().optional(),
            body('isRenewable').isBoolean().optional(),
            body('isPromoted').isBoolean().optional(),
            body('requirement').isString().optional(),
            postingsController.patch
        ]);
        this.app.get(`/postings/apply/:postingId`,
            // to implement:
            // verify user has Validated_User permission
            // Verify User Is Logged in
            // push user id to applicants_id Array
            postingsMiddleware.validatePostingsExist,
            jwtMiddleware.validJWTNeeded,
            PermissionMiddleware.permissionFlagRequired(PermissionFlag.VALIDATED_USER),
            postingsMiddleware.validateOneApplicationPerUser,
            postingsMiddleware.pushUserIdToPosting,
            postingsController.patch

        )

        return this.app;
    }
}