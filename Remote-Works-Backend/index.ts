
import { CommonRoutesConfig } from './src/common/common.route.config';
import { UsersRoutes } from './src/routes/users.route.config';
import { AuthRoutes } from './src/routes/auth.routes.config';
import { BusinessRoutes } from './src/routes/business.routes.config'
import { PostingsRoutes } from './src/routes/postings.route.config';
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import helmet from "helmet";
import nocache from "nocache";
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';



const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

if (!(process.env.PORT || process.env.MONGO_URL || process.env.JWT_SECRET)) {
  throw new Error(
    "Missing required environment variables."
  );
}

const app: Express = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT
const routes: Array<CommonRoutesConfig> = []; //the routes array will keep tract of our route for debugging purposes
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());
app.set("json spaces", 2);


app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());


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

  if (typeof global.it === 'function') loggerOptions.level = 'http'; // mute the debugger if running non-debug tests
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// Adding routes to the routes array
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new BusinessRoutes(app));
routes.push(new PostingsRoutes(app));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server(is Running)');
});

export default app.listen(PORT, () => {

  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});



 