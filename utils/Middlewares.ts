import express, { Application } from 'express'
import path from 'path'
import session from 'express-session'
import sessionFileStore from 'session-file-store'
import cors from 'cors';
import { SessionSecretKey, CorsEnabled, CorsOptions } from '../config'

export function LoadMiddlewares(app : Application) : void{
    app.use(express.static(path.join(__dirname, '../view')));

	if(CorsEnabled){
		app.use(cors(CorsOptions));
	}

	app.use(express.json({limit: '10mb'}));
	app.use(express.urlencoded({limit: '10mb', extended: true}));

    // Session Middleware
	var FileStore = sessionFileStore(session);
	app.use(session({
		secret: SessionSecretKey,
		store: new FileStore({ 
			path: path.join(__dirname, '../sessions'),
		}),
		resave: false,
		saveUninitialized: true
	}));
}

declare module 'express-session' {
	interface SessionData {
		adminLoggedIn: boolean;
	}
  }