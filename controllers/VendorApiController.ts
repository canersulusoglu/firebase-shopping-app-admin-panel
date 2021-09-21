import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'

export class VendorApiController{

    searchVendor(req : Request, res : Response){
        var { searchInput, searchType, limit = 10 } : SearchBody  = req.body;
        firebaseAdmin.firestore()
            .collection("Vendors")
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

    getVendors(req : Request, res : Response){
        var { limit, offset } : getVendorsBody = req.body;
        firebaseAdmin.firestore().collection("Vendors")
        .listDocuments().then(docList => {
            firebaseAdmin.firestore().collection("Vendors")
            .orderBy('name')
            .offset(offset || 0)
            .limit(limit || 10)
            .get().then((data) => {
                var vendorsData = data.docs.map(e => {
                    return {
                        id: e.id,
                        data: e.data()
                    }
                })
                res.json({isSuccess: true, data: vendorsData, totalVendorCount: docList.length});
            }).catch(err => {
                res.json({isSuccess: false});
            });
        })
        .catch(err => {
            res.json({isSuccess: false});
        });
    }

    getVendor(req : Request, res : Response){
        var { vendorId } : getVendorBody = req.body;
        if(vendorId){
            firebaseAdmin.firestore().collection("Vendors").doc(vendorId).get().then((data) => {
                res.json({isSuccess: true, data: data});
            }).catch(err => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    updateVendorInfos(req : Request, res : Response){
        var { vendorId, vendorData } : updateVendorInfosBody = req.body;
        if(vendorId && vendorData){
            var vendor = new Vendor(vendorData).toJson();
            firebaseAdmin.firestore().collection("Vendors").doc(vendorId).update(vendor).then((data) =>{
                res.json({isSuccess: true});
            })
            .catch(error => {
                res.json({isSuccess: false});
            })
        }else{
            res.json({isSuccess: false});
        }
    }

    addVendor(req : Request, res : Response){
        var { vendorData } : addVendorBody = req.body;
        if(vendorData){
            var vendor = new Vendor(vendorData).toJson();
            firebaseAdmin.firestore().collection("Vendors").add(vendor).then(data => {
                res.json({isSuccess: true});
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
    searchType: 'name' | 'vendorId',
    limit: number
}

type getVendorsBody = {
    limit?: number
    offset?: number
}

type getVendorBody = {
    vendorId: string
}

type updateVendorInfosBody = {
    vendorId: string,
    vendorData: VendorData
}

type addVendorBody = {
    vendorData: VendorData
}

type VendorData = {
    name: string,
    email: string,
    city: string,
    contact: string
}


class Vendor{
    name: string;
    email: string;
    city: string;
    contact: string;

    constructor(vendorData : VendorData){
        this.name = vendorData.name;
        this.email = vendorData.email;
        this.city = vendorData.city;
        this.contact = vendorData.contact;
    }

    toJson(){
        var vendor : any = {};
        if(this.name) vendor['name'] = this.name;
        if(this.email) vendor['email'] = this.email;
        if(this.city) vendor['city'] = this.city;
        if(this.contact) vendor['contact'] = this.contact;
        
        return vendor;
    }
}