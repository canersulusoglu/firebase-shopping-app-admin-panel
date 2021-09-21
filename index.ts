import express, { Application } from 'express'
import { Server } from 'http'
import firebaseAdmin from 'firebase-admin'
import serviceAccount from './service-account-key.json'
import { ServerPort, FirebaseStorageBucket } from './config'
import { LoadMiddlewares } from './utils/Middlewares'
import { LoadRoutes } from './routes'


class App{
    app: Application;
    http: Server;
    port: Number;
    constructor(){
        this.port = ServerPort;
        this.app = express();
        this.http = new Server(this.app);
    }

    initializeFirebaseAdminSDK(){
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount),
            storageBucket: FirebaseStorageBucket
        });
    }

    startServer(){
        LoadMiddlewares(this.app);
        LoadRoutes(this.app);
        this.initializeFirebaseAdminSDK();
        
        this.http.listen(this.port, () => {
            console.log(`Listening on : ${this.port}`);
        });
    }
}


const app = new App();
app.startServer();