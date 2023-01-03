import express from 'express';
import postingsService from '../services/postings.service';
import debug from 'debug';
import usersDao from '../../users/dao/users.dao';
import businessDao from '../../business/dao/business.dao';

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
        console.log(" req.body : " + JSON.stringify(req.body));
        console.log(" res.locals.postings : " + res.locals.postings);
        console.log(" res.locals.jwt : " + res.locals.jwt);
        next();
    }

    // async pushPostingIdToBusiness (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     res.locals.postings.applicants_id.push(res.locals.jwt.userId);
    //     req.body.applicants_id = res.locals.postings.applicants_id;
    //     await usersDao.updateUserApplications(res.locals.jwt.userId, res.locals.postings._id)
    //     next();
    // }

    async businessIdToBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.business_id = res.locals.jwt.userId;
        next();
    }

    async businessNameToBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let business = await businessDao.getBusinessById(res.locals.jwt.userId);
        
        if(business) {
            req.body.business_name = business.name;
        }

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

    async extractBusinessId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.businessId;
        next();
    }
    
    async pushUserIdToPosting(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        res.locals.postings.applicants_id.push(res.locals.jwt.userId);
        req.body.applicants_id = res.locals.postings.applicants_id;
        await usersDao.updateUserApplications(res.locals.jwt.userId, res.locals.postings._id)
        
        next();
    }
 
    async validateOneApplicationPerUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if(!res.locals.postings.applicants_id.includes(res.locals.jwt.userId)) {
            return next();
        }
        res.status(400).send('User has already applied to current posting')
    }
}

export default new PostingsMiddleware();