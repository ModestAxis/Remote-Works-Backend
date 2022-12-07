import express from 'express';
import BusinessService from '../services/business.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:business-controller');

class BusinessMiddleware {

    async validateRequiredBusinessBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields email and password`,
            });
        }
    }
    
    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const business = await BusinessService.getBusinessByEmail(req.body.email);
        if (business) {
            res.status(400).send({ error: `Business email already exists` });
        } else {
            next();
        }
    }
    
    async validateSameEmailBelongToSameBusiness(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (res.locals.business._id === req.params.businessId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }
    
    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email) {
            log('Validating email', req.body.email);
    
            this.validateSameEmailBelongToSameBusiness(req, res, next);
        } else {
            next();
        }
    };
    
    async validateBusinessExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const business = await BusinessService.readById(req.params.businessId);
        if (business) {
            res.locals.business = business;
            next();
        } else {
            res.status(404).send({
                error: `Business ${req.params.businessId} not found`,
            });
        }
    }

    async extractBusinessId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.businessId;
        next();
    }

    async BusinessCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if(
            'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.Business.permissionFlags
        ) {
            res.status(400).send({
                error: ['Business cannot change permission flags']
            })
        } else {
            next();
        }
    }

}

export default new BusinessMiddleware();