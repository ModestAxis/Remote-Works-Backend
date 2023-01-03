import express from 'express';
import usersService from '../services/users.service';
import bcrypt from 'bcrypt';
import debug from 'debug';

const log: debug.IDebugger = debug('app:user-controller');

class UsersController {


    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.body.id);
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        const salt: string = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const userId = await usersService.create(req.body);
        res.status(201).send({ id: userId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            const salt: string = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        log(await usersService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {

        const salt: string = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        log(await usersService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.body.id));
        res.status(204).send();
    }

    async sendUserApplications(req: express.Request, res: express.Response) {
        
        res.status(200).send(req.body.applications);
    }
    
}

export default new UsersController();