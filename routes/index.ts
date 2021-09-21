import { Application } from 'express'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import AuthRoute from './AuthRoute'
import ApiRoute from './ApiRoute'

export function LoadRoutes(app : Application){
	// Api Routes
	app.use('/auth', AuthRoute);
	app.use('/api', ApiRoute);

	// Static Routes
	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, "../Build/view/index.html"));
	});
}