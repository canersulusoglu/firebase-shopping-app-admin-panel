import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export class CardApiController{

    searchCard(req: Request, res: Response){
        var { searchInput, searchType, limit = 10 } : SearchBody = req.body;
        if(searchInput && searchType){
            firebaseAdmin.firestore()
            .collection("Cards")
            .limit(limit)
            .orderBy(searchType)
            .startAt(searchInput)
            .endAt(searchInput + '~')
            .get().then((data) => {
                res.json({isSuccess: true, data: data.docs});
            }).catch(err => {
                res.json({isSuccess: false});
            });
        }else{
            res.json({isSuccess: false});
        }
    }

    getCards(req: Request, res: Response){
        try {
            firebaseAdmin.firestore().collection("Cards")
            .get().then((data) => {
                var cardsData = data.docs.map(e => {
                    return {
                        id: e.id,
                        data: e.data()
                    }
                })
                res.json({isSuccess: true, data: cardsData});
            }).catch(err => {
                res.json({isSuccess: false});
            });
        } catch (error) {
            res.json({isSuccess: false});
        }
    }

    getCard(req: Request, res: Response){
        var { cardId } : getCardBody = req.body;
        if(cardId){
            firebaseAdmin.firestore().collection("Cards").doc(cardId).get().then((data) => {
                res.json({isSuccess: true, data: data});
            }).catch(err => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    getCardImage(req: Request, res: Response){
        var { cardId } : getCardBody = req.body;
        if(cardId){
            firebaseAdmin.storage().bucket().getFiles({directory: `Cards/${cardId}/`}).then((data) =>{
                var result = data[0].map((e, index) => {
                    if (e.metadata.size != "0"){
                        return {
                            name: e.metadata.name,
                            url: "https://storage.cloud.google.com/"+ e.metadata.bucket + "/" +e.metadata.name,
                            size: e.metadata.size,
                            contentType: e.metadata.contentType
                        }
                    }
                }).filter(e => e);
                res.json({isSuccess: true, data: result});
            }).catch(err => {
                res.json({isSuccess: false});
            });
        }else{
            res.json({isSuccess: false});
        }
    }

    updateCardInfos(req: Request, res: Response){
        var { cardId, cardData } : updateCardInfosBody = req.body;
        if(cardId && cardData){
            var card = new Card(cardData).toJson();
            firebaseAdmin.firestore().collection("Cards").doc(cardId).update(card).then((data) =>{
                res.json({isSuccess: true});
            })
            .catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    updateCardImage(req: Request, res: Response){
        var { cardId, image } : updateCardImageBody = req.body;
        if(cardId && image){
            firebaseAdmin.storage().bucket().deleteFiles({directory:`Cards/${cardId}/`}).then(deletedCardImageData => {
                var imagePath = path.join(__dirname, "../temp", `${image.name}`);
                var imageData = image.data_url.replace(/^data:image\/\w+;base64,/, "");
                var buf = Buffer.from(imageData, 'base64');
                const accessToken = uuidv4();
                fs.writeFile(imagePath, buf, (writeErr) =>{
                    if(!writeErr){
                        firebaseAdmin.storage().bucket().upload(
                            imagePath, 
                            {
                                destination: `Cards/${cardId}/${image.name}`, 
                                metadata: {
                                    metadata:{
                                        firebaseStorageDownloadTokens: accessToken
                                    }
                                },
                                contentType: image.type,
                            }
                        ).then(data => {
                            fs.unlink(imagePath, (unlinkErr) =>{
                                if(!unlinkErr){
                                    res.json({isSuccess: true});
                                }else{
                                    res.json({isSuccess: false});
                                }
                            })
                        }).catch(error => {
                            res.json({isSuccess: false});
                        })
                    }else{
                        res.json({isSuccess: false});
                    }
                })
            }).catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    addCard(req: Request, res: Response){
        var { cardData, cardImage } : addCardBody = req.body;
        if(cardData && cardImage){
            var card = new Card(cardData).toJson();
            firebaseAdmin.firestore().collection("Cards").add(card).then(addedCardData => {
                var cardId = addedCardData.id;
                var imagePath = path.join(__dirname, "../temp", `${cardImage.name}`);
                var imageData = cardImage.data_url.replace(/^data:image\/\w+;base64,/, "");
                var buf = Buffer.from(imageData, 'base64');
                const accessToken = uuidv4();
                fs.writeFile(imagePath, buf, (writeErr) =>{
                    if(!writeErr){
                        firebaseAdmin.storage().bucket().upload(
                            imagePath, 
                            {
                                destination: `Cards/${cardId}/${cardImage.name}`, 
                                metadata: {
                                    metadata:{
                                        firebaseStorageDownloadTokens: accessToken
                                    }
                                },
                                contentType: cardImage.type,
                            }
                        ).then(data => {
                            fs.unlink(imagePath, (unlinkErr) =>{
                                if(!unlinkErr){
                                    res.json({isSuccess: true});
                                }else{
                                    res.json({isSuccess: false});
                                }
                            })
                        }).catch(error => {
                            res.json({isSuccess: false});
                        })
                    }else{
                        res.json({isSuccess: false});
                    }
                })
            }).catch(err =>{
                res.json({isSuccess: false});
            });
        }else{
            res.json({isSuccess: false});
        }
    }
    
}

type SearchBody = {
    searchInput: string,
    searchType: 'name' | 'cardId',
    limit?: number
}

type getCardBody = {
    cardId: string
}

type updateCardInfosBody = {
    cardId: string,
    cardData: CardData
}

type updateCardImageBody = {
    cardId: string,
    image: CardImageData
}

type addCardBody = {
    cardData: CardData,
    cardImage: CardImageData
}

type CardData = {
    name: string
}

type CardImageData = {
    data_url: any,
    name: string,
    type: string,
    size: number
}


class Card{
    name: string;

    constructor(cardData : CardData){
        this.name = cardData.name;
    }

    toJson(){
        var card : any = {};
        if(this.name) card['name'] = this.name;
        
        return card;
    }
}