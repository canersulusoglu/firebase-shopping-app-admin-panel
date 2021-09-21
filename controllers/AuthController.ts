import { Request, Response } from 'express'
import { AdminPanelUsername, AdminPanelPassword } from '../config'

export class AuthController{
    login(req: Request, res: Response){
        var { username, password } : loginBody = req.body;
        if(username&& password){
            var isValid = (username == AdminPanelUsername) && (password == AdminPanelPassword);
            if(isValid){
                req.session.adminLoggedIn = true;
                res.json({isSuccessful: true});
            }else{
                req.session.adminLoggedIn = false;
                res.json({isSuccessful: false});
            }
        }
    }

    logout(req: Request, res: Response){
        req.session.adminLoggedIn = false;
        res.json({isSuccessful: true});
    }

    loginControl(req: Request, res: Response){
        if(req.session.adminLoggedIn == true){
            res.json({isSuccessful: true});
        }else{
            res.json({isSuccessful: false});
        }
    }
}

type loginBody = {
    username: string,
    password: string
}