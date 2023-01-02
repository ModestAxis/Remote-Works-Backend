import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import shortid from 'shortid';
import postingDao from '../../postings/dao/posting.dao';

const log: debug.IDebugger = debug('app:users-middleware');

class UsersMiddleware {

    async validateRequiredUserBodyFields(
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
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    }
    
    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (res.locals.user._id === req.params.userId) {
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
    
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };
    
    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }

    async extractUserIdFromJwt(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // req.body.id = res.locals.jwt.userId;
        console.log(req.body.id);
        next();
    }

    //format the request for a patch request on the experience array of a user
    async pushExperienceToArray(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let id = req.body.id;
        //we delete the id that was pushed in extractId we dont need it in the experiences array
        delete req.body.id;

        req.body.expId = shortid.generate();

        //a little hacky but it works well enough...
        //here we push the body sent from the client to the user copy in res.locals that we get in validateUserExist
        //we empty the req and then format the body the way we want send the req to be patched down the pipeline
        res.locals.user.experiences.push(req.body);
        req.body = {};
        req.body.id = id;
        req.body.experiences = res.locals.user.experiences;
        
        next();
    }

    async removeExperienceFromArray(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.experiences = res.locals.user.experiences.filter((ele : any) =>  ele.expId != req.body.expId)
        next();
    }

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if(
            'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags
        ) {
            res.status(400).send({
                error: ['User cannot change permission flags']
            })
        } else {
            next();
        }
    }

    

    async getUserApplication(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let body : Array<any> = [];
        for( let app of res.locals.user.applications) {
             body.push( await postingDao.getPostingsById(app))  
        }
        
        req.body.applications = body;
        
        next();
    }
}

export default new UsersMiddleware();