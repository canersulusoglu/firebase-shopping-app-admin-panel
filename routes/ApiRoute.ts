import { Router } from 'express'
import { 
    CardApiController, 
    BrandApiController, 
    VendorApiController, 
    ProductApiController,  
    FireStoreApiController
} from '../controllers'

const router = Router();

/**
 * Routing for Api
 */

const cardApiController = new CardApiController();
const brandApiController = new BrandApiController();
const vendorApiController = new VendorApiController();
const productApiController = new ProductApiController();
const fireStoreApiController = new FireStoreApiController();


// Card
router.post("/searchCard", (req, res) => cardApiController.searchCard(req, res));
router.post("/getCards", (req, res) => cardApiController.getCards(req, res));
router.post("/getCard", (req, res) => cardApiController.getCard(req, res));
router.post("/getCardImage", (req, res) => cardApiController.getCardImage(req, res));
router.post("/updateCardInfos", (req, res) => cardApiController.updateCardInfos(req, res));
router.post("/updateCardImage", (req, res) => cardApiController.updateCardImage(req, res));
router.post("/addCard", (req, res) => cardApiController.addCard(req, res));

// Brand
router.post("/searchBrand", (req, res) => brandApiController.searchBrand(req, res));
router.post("/getBrands", (req, res) => brandApiController.getBrands(req, res));
router.post("/getBrand", (req, res) => brandApiController.getBrand(req, res));
router.post("/getBrandLogo", (req, res) => brandApiController.getBrandLogo(req, res));
router.post("/updateBrandInfos", (req, res) => brandApiController.updateBrandInfos(req, res));
router.post("/updateBrandLogo", (req, res) => brandApiController.updateBrandLogo(req, res));
router.post("/addBrand", (req, res) => brandApiController.addBrand(req, res));

// Vendor
router.post("/searchVendor", (req, res) => vendorApiController.searchVendor(req, res));
router.post("/getVendors", (req, res) => vendorApiController.getVendors(req, res));
router.post("/getVendor", (req, res) => vendorApiController.getVendor(req, res));
router.post("/updateVendorInfos", (req, res) => vendorApiController.updateVendorInfos(req, res));
router.post("/addVendor", (req, res) => vendorApiController.addVendor(req, res));

// Product
router.post("/searchProduct", (req, res) => productApiController.searchProduct(req, res));
router.post("/getProducts", (req, res) => productApiController.getProducts(req, res));
router.post("/getProduct", (req, res) => productApiController.getProduct(req, res));
router.post("/getProductImages", (req, res) => productApiController.getProductImages(req, res));
router.post("/updateProductInfos", (req, res) => productApiController.updateProductInfos(req, res));
router.post("/uploadProductImage", (req, res) => productApiController.uploadProductImage(req, res));
router.post("/addProduct", (req, res) => productApiController.addProduct(req, res));

// FireStore
router.post("/deleteImage", (req, res) => fireStoreApiController.deleteImage(req, res));

export default router;