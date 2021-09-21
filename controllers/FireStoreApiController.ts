import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'

export class FireStoreApiController{

    deleteImage(req : Request, res : Response){
        var { imageName } : deleteImageBody  = req.body;
        if(imageName){
            firebaseAdmin.storage().bucket().file(imageName).delete().then(data => {
                res.json({isSuccess: true});
            }).catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

}

type deleteImageBody = {
    imageName: string
}