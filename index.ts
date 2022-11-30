import { TemplateRoutes } from './src/routes/template/template.routes.config';
import { CommonRoutesConfig } from './src/common/common.route.config';
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';


dotenv.config()

const app: Express = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT
const routes: Array<CommonRoutesConfig> = []; //the routes array will keep tract of our route for debugging purposes
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());
// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// Adding routes to the routes array
routes.push(new TemplateRoutes(app));


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server(is Running)');
});

app.listen(PORT, () => {

  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

 