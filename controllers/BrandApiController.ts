import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export class BrandApiController{

    searchBrand(req: Request, res: Response){
        var { searchInput, searchType, limit = 10 } : SearchBody = req.body;
        firebaseAdmin.firestore()
            .collection("Brands")
            .limit(limit)
            .orderBy(searchType)
            .startAt(searchInput)
            .endAt(searchInput + '~')
            .get().then((data) => {
                res.json({isSuccess: true, data: data.docs});
            }).catch(err => {
                res.json({isSuccess: false});
            });
    }

    getBrands(req: Request, res: Response){
        var { limit, offset } : getBrandsBody = req.body;
        firebaseAdmin.firestore().collection("Brands")
        .listDocuments().then(docList => {
            firebaseAdmin.firestore().collection("Brands")
            .orderBy('name')
            .offset(offset || 0)
            .limit(limit || 10)
            .get().then((data) => {
                var brandsData = data.docs.map(e => {
                    return {
                        id: e.id,
                        data: e.data()
                    }
                })
                res.json({isSuccess: true, data: brandsData, totalBrandCount: docList.length});
            }).catch(err => {
                res.json({isSuccess: false});
            });
        })
        .catch(err => {
            res.json({isSuccess: false});
        });
    }

    getBrand(req: Request, res: Response){
        var { brandId } : getBrandBody = req.body;
        if(brandId){
            firebaseAdmin.firestore().collection("Brands").doc(brandId).get().then((data) => {
                res.json({isSuccess: true, data: data});
            }).catch(err => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    getBrandLogo(req: Request, res: Response){
        var { brandId } : getBrandBody = req.body;
        if(brandId){
            firebaseAdmin.storage().bucket().getFiles({directory: `Brands/${brandId}/`}).then((data) =>{
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

    updateBrandInfos(req: Request, res: Response){
        var { brandId, brandData } : updateBrandInfosBody = req.body;
        if(brandId && brandData){
            var brand = new Brand(brandData).toJson();
            firebaseAdmin.firestore().collection("Brands").doc(brandId).update(brand).then((data) =>{
                res.json({isSuccess: true});
            })
            .catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    updateBrandLogo(req: Request, res: Response){
        var { brandId, image } : updateBrandLogoBody = req.body;
        if(brandId && image){
            firebaseAdmin.storage().bucket().deleteFiles({directory:`Brands/${brandId}/`}).then(deleteData => {
                var imagePath = path.join(__dirname, "../temp", `${image.name}`);
                var imageData = image.data_url.replace(/^data:image\/\w+;base64,/, "");
                var buf = Buffer.from(imageData, 'base64');
                const accessToken = uuidv4();
                fs.writeFile(imagePath, buf, (writeErr) =>{
                    if(!writeErr){
                        firebaseAdmin.storage().bucket().upload(
                            imagePath, 
                            {
                                destination: `Brands/${brandId}/${image.name}`, 
                                metadata: {
                                    metadata:{
                                        firebaseStorageDownloadTokens: accessToken
                                    }
                                },
                                contentType: image.type
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

    addBrand(req: Request, res: Response){
        var { brandData, brandLogo } : addBrandBody = req.body;
        if(brandData && brandLogo){
            var brand = new Brand(brandData).toJson();
            firebaseAdmin.firestore().collection("Brands").add(brand).then(addedBrandData => {
                var brandId = addedBrandData.id;
                var imagePath = path.join(__dirname, "../temp", `${brandLogo.name}`);
                var imageData = brandLogo.data_url.replace(/^data:image\/\w+;base64,/, "");
                var buf = Buffer.from(imageData, 'base64');
                const accessToken = uuidv4();
                fs.writeFile(imagePath, buf, (writeErr) =>{
                    if(!writeErr){
                        firebaseAdmin.storage().bucket().upload(
                            imagePath, 
                            {
                                destination: `Brands/${brandId}/${brandLogo.name}`, 
                                metadata: {
                                    metadata:{
                                        firebaseStorageDownloadTokens: accessToken
                                    }
                                },
                                contentType: brandLogo.type
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
        }
        else{
            res.json({isSuccess: false});
        }
    }
}

type SearchBody = {
    searchInput: string,
    searchType: 'name' | 'brandId',
    limit: number
}

type getBrandsBody = {
    limit?: number
    offset?: number
}

type getBrandBody = {
    brandId: string
}

type updateBrandInfosBody = {
    brandId: string,
    brandData: BrandData
}

type updateBrandLogoBody = {
    brandId: string,
    image: BrandLogoData
}

type addBrandBody = {
    brandData: BrandData,
    brandLogo: BrandLogoData
}

type BrandData = {
    name: string,
    website: string
}

type BrandLogoData = {
    data_url: any,
    name: string,
    type: string,
    size: number
}


class Brand{
    name: string;
    website: string;

    constructor(brandData : BrandData){
        this.name = brandData.name;
        this.website = brandData.website;
    }

    toJson(){
        var brand : any = {};
        if(this.name) brand['name'] = this.name;
        if(this.website) brand['website'] = this.website;
        
        return brand;
    }
}