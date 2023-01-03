import express from 'express';
import debug from 'debug';
import postingsService from '../services/postings.service';

const log: debug.IDebugger = debug('app:postings-controller');

class PostingsController {
    
    async listPostings(req: express.Request, res: express.Response) {
        const postings = await postingsService.list(100,0);
        res.status(200).send(postings)
    }

    async listBusinessPostings(req: express.Request, res: express.Response) {
        const postings = await postingsService.listBusinessPostings(req.body.id);
        res.status(200).send(postings)
    }

    
    async getPostingById(req: express.Request, res: express.Response) {
        const posting = await postingsService.readById(req.body.id);
        res.status(200).send(posting)
    }
   
    async createPosting(req: express.Request, res: express.Response) {
        //req.body.business_id = res.locals.jwt.userId;
        const postingId = await postingsService.create(req.body);
        res.status(201).send({id: postingId})
    }

    async patch(req: express.Request, res: express.Response) {
        log(await postingsService.patchById(req.body.id, req.body));
        res.status(204).send()
    }
    
    async removePosting(req: express.Request, res: express.Response) {
        log(await postingsService.deleteById(req.body.id));
        res.status(204).send()
    }
  
    
}

export default new PostingsController();