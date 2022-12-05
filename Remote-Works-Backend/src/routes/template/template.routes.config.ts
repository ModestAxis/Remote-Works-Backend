import { CommonRoutesConfig } from '../../common/common.route.config';
import express, { Application, Request, Response, NextFunction } from 'express';

export class TemplateRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'TemplateRoutes');
    }

    configureRoutes() {

        this.app.route(`/template`)
            .get((req: Request, res: Response) => {
                res.status(200).send(`List of template`);
            })
            .post((req: Request, res: Response) => {
                res.status(200).send(`Post to template`);
            });

        this.app.route(`/template/:Id`)
            .all((req: Request, res: Response, next: NextFunction) => {
                // this middleware function runs before any request to /template/:userId
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                next();
            })
            .get((req: Request, res: Response) => {
                res.status(200).send(`GET requested for id ${req.params.userId}`);
            })
            .put((req: Request, res: Response) => {
                res.status(200).send(`PUT requested for id ${req.params.userId}`);
            })
            .patch((req: Request, res: Response) => {
                res.status(200).send(`PATCH requested for id ${req.params.userId}`);
            })
            .delete((req: Request, res: Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.userId}`);
            });
        return this.app;
    }
}