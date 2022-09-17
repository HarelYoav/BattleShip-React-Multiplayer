import express, {Application} from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import {createServer, Server} from 'http';
import { ServerSocket } from './socket';


class App {
    public express: Application;
    public httpServer: Server;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        //express application
        this.express = express();
        //http Server handling
        this.httpServer = createServer(this.express);
        //start socket
        new ServerSocket(this.httpServer);
        //Listen to port
        this.port = port;

        // this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
          this.express.use('/api', controller.router)  ;
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        
        let mongoURI;
        
        if(process.env.NODE_ENV == 'development') {
            mongoURI = process.env.MONGO_DEVELOP_URL;
        } else {
            const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
            mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
        }

        if(mongoURI) {
            mongoose.connect(mongoURI);
        }
    }
        

    public listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log('Listening on', this.port);
        });
    }
}

export default App;
