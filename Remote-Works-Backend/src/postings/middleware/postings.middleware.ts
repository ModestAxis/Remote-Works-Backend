import express from 'express';
import postingsService from '../services/postings.service';
import debug from 'debug';

const log : debug.IDebugger = debug('app:postings-middleware')

class PostingsMiddleware {
    
    async validatePostingsBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.job_title && req.body.country ) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required Fields -> job_title and Country`
            })
        }
    }

    async validateOneJobTitlePerBusiness (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        //to code
        next();
    }

    async validatePostingsExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        
        const postings = await postingsService.readById(req.params.postingId);
        
        if(postings) {
            res.locals.postings = postings;
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.postingsId} not found`
            });
        }

    }

    async extractPostingsId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        
        req.body.id = req.params.postingId;
        next();
    }
}

export default new PostingsMiddleware();