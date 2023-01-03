import express from 'express';
import BusinessService from '../services/business.service';
import bcrypt from 'bcrypt';
import debug from 'debug';

const log: debug.IDebugger = debug('app:business-controller');

class BusinessController {
    
    async listBusiness(req: express.Request, res: express.Response) {
        const business = await BusinessService.list(100,0);
        res.status(200).send(business);
    }
    
    async getBusinessById(req: express.Request, res: express.Response) {
        const business = await BusinessService.readById(req.body.id);
        res.status(200).send(business);
    }

    async createBusiness(req: express.Request, res: express.Response) {
        const salt: string = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const businessId = await BusinessService.create(req.body);
        res.status(201).send({ id: businessId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            const salt: string = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        log(await BusinessService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {

        const salt: string = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        log(await BusinessService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeBusiness(req: express.Request, res: express.Response) {
        log(await BusinessService.deleteById(req.body.id));
        res.status(204).send();
    }
    
    async sendBusinessPostings(req: express.Request, res: express.Response) {
        res.status(200).send(req.body.postings)
    }
}

export default new BusinessController();
