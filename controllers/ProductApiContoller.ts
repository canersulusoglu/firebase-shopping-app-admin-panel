import { Request, Response } from 'express'
import firebaseAdmin, { firestore } from 'firebase-admin'
import fs from 'fs'
import { type } from 'os'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export class ProductApiController{
    
    searchProduct(req : Request, res : Response){
        var { searchInput, searchType, limit = 10 } : SearchBody = req.body;
        firebaseAdmin.firestore()
            .collection("Products")
            .orderBy(searchType)
            .startAt(searchInput)
            .endAt(searchInput + '~')
            .limit(limit)
            .get().then((data) => {
                res.json({isSuccess: true, data: data.docs});
            }).catch(err => {
                res.json({isSuccess: false});
            });
    }

    getProducts(req : Request, res : Response){
        try {
            var { limit, offset } : getProductsBody = req.body;
            firebaseAdmin.firestore().collection("Products")
            .listDocuments().then(docList => {
                firebaseAdmin.firestore().collection("Products")
                .orderBy('name')
                .offset(offset || 0)
                .limit(limit || 10)
                .get().then((data) => {
                    var productsData = data.docs.map(e => {
                        return {
                            id: e.id,
                            data: e.data()
                        }
                    })
                    res.json({isSuccess: true, data: productsData, totalProductCount: docList.length});
                }).catch(err => {
                    res.json({isSuccess: false});
                });
            })
            .catch(err => {
                res.json({isSuccess: false});
            });
        } catch (error) {
            res.json({isSuccess: false});
        }
    }

    getProduct(req : Request, res : Response){
        var { productId } : getProductBody = req.body;
        if(productId){
            firebaseAdmin.firestore().collection("Products").doc(productId).get().then((data) => {
                var product = {
                    ref: data.ref,
                    id: data.id,
                    data: data.data()
                }
                res.json({isSuccess: true, data: product});
            }).catch(err =>{
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    getProductImages(req : Request, res : Response){
        var { productId } : getProductBody = req.body;
        if(productId){
            firebaseAdmin.storage().bucket().getFiles({directory: `Products/${productId}/`}).then((data) =>{
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

    updateProductInfos(req : Request, res : Response){
        var { productId, productData } : updateProductInfosBody = req.body;
        if(productId && productData){
            var product = new Product(productData).toJson();
            firebaseAdmin.firestore().collection("Products").doc(productId).update(product).then((data) =>{
                res.json({isSuccess: true});
            })
            .catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    uploadProductImage(req : Request, res : Response){
        var { productId, image } : uploadProductImageBody = req.body;
        if(productId && image){
            var imagePath = path.join(__dirname, "../temp", `${image.name}`);
            var imageData = image.data_url.replace(/^data:image\/\w+;base64,/, "");
            var buf = Buffer.from(imageData, 'base64');
            const accessToken = uuidv4();
            fs.writeFile(imagePath, buf, (writeErr) =>{
                if(!writeErr){
                    firebaseAdmin.storage().bucket().upload(
                        imagePath, 
                        {
                            destination: `Products/${productId}/${image.name}`, 
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
        }else{
            res.json({isSuccess: false});
        }
    }

    addProduct(req : Request, res : Response){
        var { productData, productImages} : addProductBody = req.body;
        if(productData){
            var data = new Product(productData).toJson();
            firebaseAdmin.firestore().collection("Products").add(data).then(addedProductData => {
                var productId = addedProductData.id;
                productImages.forEach(image => {
                    var imagePath = path.join(__dirname, "../temp", `${image.name}`);
                    var imageData = image.data_url.replace(/^data:image\/\w+;base64,/, "");
                    var buf = Buffer.from(imageData, 'base64');
                    const accessToken = uuidv4();
                    fs.writeFile(imagePath, buf, (writeErr) =>{
                        if(!writeErr){
                            firebaseAdmin.storage().bucket().upload(
                                imagePath, 
                                {
                                    destination: `Products/${productId}/${image.name}`, 
                                    metadata: {
                                        metadata:{
                                            firebaseStorageDownloadTokens: accessToken
                                        }
                                    },
                                    contentType: image.type
                                }
                            ).then(data => {
                                fs.unlink(imagePath, (unlinkErr) =>{
                                    if(unlinkErr){
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
                });
                res.json({isSuccess: true});
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
    searchType: 'name' | 'productId',
    limit?: number
}

type getProductsBody = {
    limit?: number
    offset?: number
}

type getProductBody = {
    productId: string
}

type updateProductInfosBody = {
    productId: string,
    productData: ProductData
}

type uploadProductImageBody = {
    productId: string,
    image: {
        data_url: any,
        name: string,
        type: string,
        size: number
    }
}

type addProductBody = {
    productImages: Array<{
        data_url: any,
        name: string,
        type: string,
        size: number
    }>,
    productData: ProductData
}



type ProductData = {
    brandReference: string,
    categoryIds: Array<string>,
    features: Map<string,string>,
    name: string,
    vendors: Array<{
        vendorReference: string,
        cartDiscount: Number,
        discount: Number,
        price: Number,
        paymentOptions: Array<{
            cardReference: string,
            installments: Array<{
                month: Number,
                amount: Number
            }>
        }>
    }>
}

class Product{
    name: string;
    categoryIds: Array<string>;
    brandReference?: firebaseAdmin.firestore.DocumentReference;
    features: Map<string,string>;
    vendors?: Array<{
        vendorReference?: firebaseAdmin.firestore.DocumentReference,
        cartDiscount: Number,
        discount: Number,
        price: Number,
        paymentOptions: Array<{
            cardReference?: firebaseAdmin.firestore.DocumentReference,
            installments: Array<{
                month: Number,
                amount: Number
            }>
        }>
    }>;

    constructor(productData : ProductData){
        this.name = productData.name;
        this.categoryIds = productData.categoryIds;
        this.brandReference = productData.brandReference ? firebaseAdmin.firestore().doc(productData.brandReference) : undefined;
        this.features = productData.features;
        this.vendors = productData.vendors ? productData.vendors.map((vendor : any)=> {
            return {
                vendorReference: vendor.vendorReference ? firebaseAdmin.firestore().doc(vendor.vendorReference) : undefined,
                cartDiscount: Number(vendor.cartDiscount),
                discount: Number(vendor.discount),
                price: Number(vendor.price),
                paymentOptions: vendor.paymentOptions.map((payment : any) => {
                    return {
                        cardReference: payment.cardReference ? firebaseAdmin.firestore().doc(payment.cardReference) : undefined,
                        installments: payment.installments.map((installment : any) => {
                            return {
                                month: Number(installment.month),
                                amount: Number(installment.amount)
                            }
                        })
                    }
                })
            }
        }) : undefined
    }

    toJson(){
        var product : any = {};
        if(this.name) product['name'] = this.name;
        if(this.categoryIds) product['categoryIds'] = this.categoryIds;
        if(this.brandReference) product['brandReference'] = this.brandReference;
        if(this.features) product['features'] = this.features;
        if(this.vendors) product['vendors'] = this.vendors;
        
        return product;
    }
}