import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    CCol,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTabPane,
    CCard,
    CCardBody,
    CTabs,
    CCardHeader,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CFormGroup,
    CLabel,
    CInvalidFeedback,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CAlert,
    CProgress,
    CDataTable
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Select from 'react-select'
import { KeyValue } from 'react-key-value'
import ImageUploading from 'react-images-uploading';
import { categorieListFind, getAllCategories } from '../../constants'
import { 
    GetProduct, 
    GetBrand, 
    GetBrandLogo,
    GetVendor, 
    GetCard,
    GetProductImages, 
    updateProductInfos,
    deleteImage, 
    uploadProductImage,
    searchBrands,
    searchVendors,
    searchCards
} from '../../api_service'

var categoriesSelect = getAllCategories().map(e => {
    return{
        value: e.id,
        label: e.name
    }
});

const alertSeconds = 10;

const addInstallmentValuesInitial = {
    month: "",
    amount: ""
}

const Product = (props) => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const [openDeleteImageModal, setOpenDeleteImageModal] = useState(null);

    const [categorieSelectValidated, setCategorieSelectValidated] = useState(true);
    const [mainInfoFormValidated, setMainInfoFormValidated] = useState(false);

    const [brandSelectValidated, setBrandSelectValidated] = useState(false);
    const [brandSelectOptions, setBrandSelectOptions] = useState();

    const [productMainInfos, setProductMainInfos] = useState([]);
    const [productBrandInfo, setProductBrandInfo] = useState({});
    const [productImagesInfos, setProductImagesInfos] = useState([]);
    const [productBrandLogoInfos, setProductBrandLogoInfos] = useState([]);

    const [productVendorInfos, setProductVendorInfos] = useState([]);
    const [vendorSelectOptions, setVendorSelectOptions] = useState();
    const [cardSelectOptions, setCardSelectOptions] = useState();

    const [addInstallmentValues, setAddInstallmentValues] = useState(addInstallmentValuesInitial)

    const [images, setImages] = useState([]);

    
    useEffect( () => {
        GetProduct(id).then(data => {
            if(data.isSuccess){
                var ProductId = data.data.id;
                var ProductData = data.data.data;
                var brandId = ProductData.brandReference._path.segments.lastItem;
                var vendors = ProductData.vendors.map((vendor, index) => {
                    var vendorId = vendor.vendorReference._path.segments.lastItem;
                    var vendorObject = {
                        vendorId: vendorId,
                        price: vendor.price,
                        discount: vendor.discount,
                        cartDiscount: vendor.cartDiscount,
                        paymentOptions:vendor.paymentOptions.map(payment => {
                            var paymentObject = {
                                cardReference: payment.cardReference._path.segments.lastItem,
                                installments: payment.installments.map(b => {
                                    return {
                                        month: b.month,
                                        amount: b.amount
                                    }
                                })
                            }
                            var cardId = payment.cardReference._path.segments.lastItem;
                            GetCard(cardId).then(data2 => {
                                if(data2.isSuccess){
                                    paymentObject['value'] = data2.data._ref._path.segments.lastItem
                                    paymentObject['label'] = data2.data._fieldsProto.name.stringValue
                                }
                            })
                            return paymentObject;
                        })
                    }
                    GetVendor(vendorId).then(data => {
                        if(data.isSuccess){
                            var vendorName = data.data._fieldsProto.name.stringValue;
                            var vendorId = data.data._ref._path.segments.lastItem;
                            vendorObject['value'] = vendorId
                            vendorObject['label'] = vendorName
                        }
                    })
                    return vendorObject;
                });
                setProductVendorInfos(vendors);
    
    
                GetBrand(brandId).then(brandData => {
                    if(brandData.isSuccess){
                        setProductBrandInfo({
                            brandId: brandId,
                            name: brandData.data._fieldsProto.name.stringValue,
                            website: brandData.data._fieldsProto.website.stringValue
                        })
                    }
                });
    
                GetBrandLogo(brandId).then(brandLogoData => {
                    if(brandLogoData.isSuccess){
                        setProductBrandLogoInfos(brandLogoData.data);
                    }
                })
    
                setProductMainInfos({
                    productId: ProductId,
                    name: ProductData.name,
                    categoryIds: ProductData.categoryIds,
                    brandId: brandId,
                    features: Object.keys(ProductData.features).map((key,index) =>{
                        var feature =  ProductData.features[key];
                        return {
                            keyItem: key,
                            valueItem: feature[feature["valueType"]]
                        }
                    })
                });
    
                GetProductImages(id).then(imagesData => {
                    if(data.isSuccess){
                        setProductImagesInfos(imagesData.data);
                    }
                })
    
                setLoading(false);
            }
        });
    }, [id]);

    const handleMainInfoFormSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.stopPropagation();
        }
        setMainInfoFormValidated(true);

        if(categorieSelectValidated){
            var productData = {
                name: productMainInfos.name,
                categoryIds: productMainInfos.categoryIds
            }

            updateProductInfos(id, productData).then(data =>{
                if(data.isSuccess){
                    setAlertMessage("Successfully! Product infos updated.");
                    setOpenSuccessAlert(alertSeconds);
                }else{
                    setAlertMessage("Error when product infos update!");
                    setOpenErrorAlert(alertSeconds);
                }
            })
        }
    }

    const handleFeaturesFormSubmit = (event) =>{
        event.preventDefault();
        const keys = productMainInfos.features.map(e => e.keyItem);
        const values = productMainInfos.features.map(e => e.valueItem);
        const data = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
        let productData = Object.fromEntries(Object.entries(data).filter(([k, v]) => v !== "" && k !== " "));

        updateProductInfos(id, {
            features: productData
        }).then(data =>{
            if(data.isSuccess){
                setAlertMessage("Successfully! Updated features.");
                setOpenSuccessAlert(alertSeconds);
            }else{
                setAlertMessage("Error when update features!");
                setOpenErrorAlert(alertSeconds);
            }
        })
    }

    const handleDeleteImageSubmit = (imageName) => {
        setOpenDeleteImageModal(null);
        deleteImage(imageName).then(data => {
            if(data.isSuccess){
                setAlertMessage("Successfully! Deleted image.");
                setOpenSuccessAlert(alertSeconds);
                productImagesInfos.splice(productImagesInfos.indexOf(productImagesInfos.find(e => e.name === imageName)), 1);
            }else{
                setAlertMessage("Error when deletes image!");
                setOpenErrorAlert(alertSeconds);
            }
        })
    }

    const handleAddNewImagesFormSubmit = () =>{
        images.forEach(image => {
            var imageData = {
                data_url: image.data_url,
                name: image.file.name,
                type: image.file.type,
                size: image.file.size
            }
            uploadProductImage(id, imageData).then(data => {
                if(data.isSuccess){
                    setAlertMessage("Successfully! Uploaded image.");
                    setOpenSuccessAlert(alertSeconds);
                }else{
                    setAlertMessage("Error when uploads image!");
                    setOpenErrorAlert(alertSeconds);
                }
            })
        });
    }

    const handleChangeBrandSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        var brandId = form.brand.value;
        if(brandId.length !== 0){
            var productUpdateData = {
                brandReference: "/Brands/" + brandId
            }
            updateProductInfos(id, productUpdateData).then(data => {
                if(data.isSuccess){
                    setAlertMessage("Successfully! Product brand changed.");
                    setOpenSuccessAlert(alertSeconds);
                    GetBrand(brandId).then(brandData => {
                        if(brandData.isSuccess){
                            setProductBrandInfo({
                                brandId: brandId,
                                name: brandData.data._fieldsProto.name.stringValue,
                                website: brandData.data._fieldsProto.website.stringValue
                            })
                        }
                    });
                    GetBrandLogo(brandId).then(brandLogoData => {
                        if(brandLogoData.isSuccess){
                            setProductBrandLogoInfos(brandLogoData.data);
                        }
                    })
                }else{
                    setAlertMessage("Error when changes product brand!");
                    setOpenErrorAlert(alertSeconds);
                }
            })
        }
    }

    const handleUpdateVendorsSubmit = (event) => {
        event.preventDefault()
        var actualData = productVendorInfos.map(e => {
            return{
                price: e.price,
                discount: e.discount,
                cartDiscount: e.cartDiscount,
                vendorReference: '/Vendors/' + e.value,
                paymentOptions: e.paymentOptions.map(a => {
                    return{
                        cardReference: '/Cards/' + a.value,
                        installments: a.installments
                    }
                })
            }
        });

        updateProductInfos(id, {vendors: actualData}).then(data => {
            if(data.isSuccess){
                setAlertMessage("Successfully! Product vendor(s) updated.");
                setOpenSuccessAlert(alertSeconds);
            }else{
                setAlertMessage("Error when changes product vendor(s)!");
                setOpenErrorAlert(alertSeconds);
            }
        })
    }

    const searchBrand = (value) =>{
        if(value.length > 3){
            searchBrands(value, 'name', 5).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e =>{
                        return{
                            value: e._ref._path.segments.lastItem,
                            label: e._fieldsProto.name.stringValue
                        }
                    });
                    setBrandSelectOptions(actualData);
                }
            })
        }
    }

    const searchVendor = (value) =>{
        if(value.length > 3){
            searchVendors(value, 'name', 5).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e =>{
                        return{
                            value: e._ref._path.segments.lastItem,
                            label: e._fieldsProto.name.stringValue
                        }
                    });
                    setVendorSelectOptions(actualData);
                }
            })
        }
    }

    const searchCard = (value) =>{
        if(value.length > 3){
            searchCards(value, 'name', 5).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e =>{
                        return{
                            value: e._ref._path.segments.lastItem,
                            label: e._fieldsProto.name.stringValue
                        }
                    });
                    setCardSelectOptions(actualData);
                }
            })
        }
    }

    

    if(loading){
        return <div>Loading...</div>;
    }

    return(
        <CRow>
            <CCol xs="12" md="12" sm="12">
                <CAlert
                    color="success"
                    show={openSuccessAlert}
                    closeButton
                    onShowChange={setOpenSuccessAlert}
                >
                    <p className="mb-2"> {alertMessage}</p>
                    <CProgress
                        striped
                        color="success"
                        value={Number(openSuccessAlert) * 10}
                        size="xs"
                    />
                </CAlert>
            </CCol>
            <CCol xs="12" md="12" sm="12">
                <CAlert
                    color="warning"
                    show={openErrorAlert}
                    closeButton
                    onShowChange={setOpenErrorAlert}
                >
                    <p className="mb-2"> {alertMessage}</p>
                    <CProgress
                        striped
                        color="warning"
                        value={Number(openErrorAlert) * 10}
                        size="xs"
                        className="mb-3"
                    />
                </CAlert>
            </CCol>
            <CCol xs="12" md="12" sm="12" className="mb-4">
                <CCard>
                    <CCardHeader>
                        {productMainInfos.productId} - {productMainInfos.name}
                    </CCardHeader>
                    <CCardBody>
                        <CTabs>
                        <CNav variant="tabs">
                            <CNavItem>
                                <CNavLink>
                                    Main Infos
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Pictures
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Features
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Brand Info
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Vendors
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane>
                                <CRow>
                                    <CCol xs="12" sm="12">
                                        <CCard className="mt-4">
                                            <CCardHeader>
                                                Product Basic Infos
                                            </CCardHeader>
                                            <CCardBody>
                                                <CForm 
                                                    className="was-validated"
                                                    wasValidated={mainInfoFormValidated}
                                                    onSubmit={handleMainInfoFormSubmit}
                                                >
                                                    <CFormGroup className="mb-4">
                                                        <CLabel htmlFor="nf-email">Product Name</CLabel>
                                                        <CInputGroup>
                                                            <CInputGroupPrepend>
                                                                <CInputGroupText>
                                                                    <CIcon name="cil-layers" />
                                                                </CInputGroupText>
                                                            </CInputGroupPrepend>
                                                            <CInput 
                                                                type="text" 
                                                                placeholder="Product Name" 
                                                                autoComplete="name" 
                                                                name="name"
                                                                value={productMainInfos.name}
                                                                onChange={(e)=>{
                                                                    setProductMainInfos({
                                                                        ...productMainInfos,
                                                                        name: e.target.value
                                                                    });
                                                                }}
                                                                required
                                                            />
                                                        </CInputGroup>
                                                    </CFormGroup>
                                                    <CFormGroup className="mb-4">
                                                        <CLabel>Categories</CLabel>
                                                        {
                                                            productMainInfos.categoryIds ?
                                                            <Select 
                                                                invalid id="inputIsInvalid" 
                                                                className="flex"
                                                                isMulti
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                options={categoriesSelect} 
                                                                defaultValue={
                                                                    productMainInfos.categoryIds.map(e => {
                                                                        return {
                                                                            value: e,
                                                                            label: categorieListFind("id", e).name
                                                                        }
                                                                    })
                                                                }
                                                                onChange={(e) => {
                                                                    if(e.length === 0){
                                                                        setCategorieSelectValidated(false);
                                                                    }else{
                                                                        setCategorieSelectValidated(true);
                                                                    }
                                                                    setProductMainInfos({
                                                                        ...productMainInfos,
                                                                        categoryIds: e.map(a => a.value),
                                                                    });
                                                                }}
                                                            />
                                                            : null
                                                        }
                                                        {
                                                            (!categorieSelectValidated) ?
                                                            <CInvalidFeedback className="d-block">
                                                                At least 1 category must be selected.
                                                            </CInvalidFeedback>
                                                            : null
                                                        }
                                                    </CFormGroup>
                                                    <div className="d-flex justify-content-end">
                                                        <CButton type="submit"shape="pill" color="danger" className="mt-4">Change Infos</CButton>
                                                    </div>
                                                </CForm>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                            </CTabPane>
                            <CTabPane>
                                <CTabs>
                                    <CNav variant="tabs" className="mt-4">
                                        <CNavItem>
                                            <CNavLink>
                                                Product Pictures
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink>
                                                Add New Picture
                                            </CNavLink>
                                        </CNavItem>
                                    </CNav>
                                    <CTabContent>
                                        <CTabPane className="mt-4">
                                            <CCard>
                                                <CCardHeader>
                                                    Product Pictures
                                                </CCardHeader>
                                                <CCardBody>
                                                    {
                                                        productImagesInfos.length > 0 ?
                                                        <div className="images-grid">
                                                            {
                                                                productImagesInfos.map((imageData, index) => {
                                                                    return(
                                                                        <CCard key={index} className="images-grid-image" borderColor="danger">
                                                                            <CCardHeader>
                                                                                {imageData.name}
                                                                            </CCardHeader>
                                                                            <CCardBody>
                                                                                <img src={imageData.url} alt={imageData.name}></img>
                                                                                <div className="d-flex justify-content-end">
                                                                                    <CButton onClick={ () => setOpenDeleteImageModal(imageData.name)} shape="pill" color="danger" className="mt-4">Delete Image</CButton>
                                                                                </div>
                                                                            </CCardBody>
                                                                        </CCard>    
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        : null
                                                    }
                                                    <CModal
                                                        show={openDeleteImageModal != null} 
                                                        onClose={() => setOpenDeleteImageModal(null)}
                                                        color="danger"
                                                        >
                                                        <CModalHeader>
                                                            <CModalTitle>Are you sure to delete this picture?</CModalTitle>
                                                        </CModalHeader>
                                                        <CModalBody>
                                                            By click confirm button, this picture will be deleted permanently!
                                                        </CModalBody>
                                                        <CModalFooter>
                                                            <CButton color="danger" onClick={() => handleDeleteImageSubmit(openDeleteImageModal)}>Confirm Delete</CButton>
                                                            <CButton color="secondary" onClick={() => setOpenDeleteImageModal(null)}>Cancel</CButton>
                                                        </CModalFooter>
                                                    </CModal>
                                                </CCardBody>
                                            </CCard>
                                        </CTabPane>
                                        <CTabPane className="mt-4">
                                            <CCard>
                                                <CCardHeader>
                                                Add New Picture
                                                </CCardHeader>
                                                <CCardBody>
                                                    <ImageUploading
                                                        multiple
                                                        value={images}
                                                        onChange={(imageList, addUpdateIndex) => {
                                                            setImages(imageList);
                                                        }}
                                                        dataURLKey="data_url"
                                                    >
                                                    {({
                                                        imageList,
                                                        onImageUpload,
                                                        onImageRemoveAll,
                                                        onImageUpdate,
                                                        onImageRemove,
                                                        isDragging,
                                                        dragProps,
                                                    }) => (
                                                        <div className="upload__image-wrapper">
                                                            <div className="buttons">
                                                                <button
                                                                    style={isDragging ? { color: 'red' } : undefined}
                                                                    onClick={onImageUpload}
                                                                    {...dragProps}
                                                                >
                                                                    Click or Drop here
                                                                </button>
                                                                &nbsp;
                                                                <button onClick={onImageRemoveAll}>Remove all images</button>
                                                            </div>
                                                            <div className="images">
                                                            {imageList.map((image, index) => (
                                                                <div key={index} className="image-item">
                                                                    <img src={image['data_url']} alt="" />
                                                                    <div className="image-item__btn-wrapper">
                                                                        <button onClick={() => onImageUpdate(index)}>Update</button>
                                                                        <button onClick={() => onImageRemove(index)}>Remove</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    </ImageUploading>
                                                    <div>
                                                        <CButton onClick={handleAddNewImagesFormSubmit} block shape="pill" color="danger" className="mt-4">Add Images</CButton>
                                                    </div>
                                                </CCardBody>
                                            </CCard>
                                        </CTabPane>
                                    </CTabContent>
                                </CTabs>
                            </CTabPane>
                            <CTabPane>
                                <CCard className="mt-4">
                                    <CCardHeader>
                                    Features
                                    </CCardHeader>
                                    <CCardBody>
                                    {
                                        (productMainInfos.features != null) ? 
                                        <div>
                                            <KeyValue
                                                rows={productMainInfos.features}
                                                customAddButtonRenderer={ (handleAddNew) => (
                                                    <div>
                                                        <CButton onClick={ handleAddNew } type="submit" block shape="pill" color="primary" className="mt-4">+ Add</CButton>
                                                    </div>
                                                ) }
                                                onChange={ (rows) => {
                                                    setProductMainInfos({
                                                        ...productMainInfos,
                                                        features: rows
                                                    });
                                                }}
                                            />
                                            <div className="d-flex justify-content-end">
                                                <CButton onClick={handleFeaturesFormSubmit} shape="pill" color="danger" className="mt-4">Change Features</CButton>
                                            </div>
                                        </div>
                                        : null
                                    }
                                    </CCardBody>
                                </CCard>
                            </CTabPane>
                            <CTabPane>
                                <CCard className="mt-4">
                                    <CCardHeader>
                                        Brand Info
                                    </CCardHeader>
                                    <CCardBody>
                                        <CCard borderColor="danger">
                                            <CCardHeader>
                                                <Link to={"/brands/" + productBrandInfo.brandId}>{productBrandInfo.name}</Link>
                                                <a className="ml-5" href={productBrandInfo.website} target="_blank" rel="noreferrer">
                                                    Go to Product Website
                                                </a>
                                            </CCardHeader>
                                            <CCardBody className="d-flex flex-column">
                                                {
                                                    productBrandLogoInfos.map((e, i) => {
                                                        return(
                                                            <img width="200" key={i} src={e.url} alt={e.name}></img>
                                                        )
                                                    })
                                                }
                                            </CCardBody>
                                        </CCard>
                                    </CCardBody>
                                </CCard>
                                <CCard className="mt-4">
                                    <CCardHeader>
                                        Change Brand
                                    </CCardHeader>
                                    <CCardBody>
                                        <CForm
                                            onSubmit={handleChangeBrandSubmit}
                                            wasValidated={brandSelectValidated}
                                        >
                                            <Select
                                                className="flex"
                                                isClearable={true}
                                                isSearchable={true}
                                                options={brandSelectOptions}
                                                onInputChange={searchBrand}
                                                name="brand"
                                                onChange={(e)=>{
                                                    if(e === null){
                                                        setBrandSelectValidated(false);
                                                    }else{
                                                        setBrandSelectValidated(true);
                                                    }
                                                }}
                                            />
                                            {
                                                (!brandSelectValidated) ?
                                                <CInvalidFeedback className="d-block">
                                                    Brand must be select!
                                                </CInvalidFeedback>
                                                : null
                                            }
                                            <div className="d-flex justify-content-end">
                                                <CButton type="submit" shape="pill" color="danger" className="mt-4">Change Brand</CButton>
                                            </div>
                                        </CForm>
                                        
                                    </CCardBody>
                                </CCard>
                            </CTabPane>
                            <CTabPane>
                                <CCard className="mt-4">
                                    <CCardHeader>
                                        Vendors
                                    </CCardHeader>
                                    <CCardBody>
                                        {
                                            productVendorInfos && productVendorInfos.length !== 0 ? 
                                            <Select
                                                className="flex mb-4"
                                                isMulti
                                                isClearable={true}
                                                isSearchable={true}
                                                value={productVendorInfos.map(e => {
                                                    return {
                                                        label: e.label,
                                                        value: e.value
                                                    }
                                                })}
                                                options={vendorSelectOptions}
                                                onInputChange={searchVendor}
                                                onChange={e => {
                                                    var newVendors = e.map(a => {
                                                        var alreadyExists = productVendorInfos.find(b => (b.value === a.value));
                                                        if(alreadyExists){
                                                            return alreadyExists;
                                                        }
                                                        return{
                                                            label: a.label,
                                                            value: a.value,
                                                            price: 0,
                                                            discount: 0,
                                                            cartDiscount: 0,
                                                            vendorReference: "/Vendors/" + a.value,
                                                            paymentOptions: []
                                                        }
                                                    });
                                                    setProductVendorInfos(newVendors);
                                                }}
                                            />
                                            : 
                                            <Select
                                                className="flex mb-4"
                                                isMulti
                                                isClearable={true}
                                                isSearchable={true}
                                                options={vendorSelectOptions}
                                                onInputChange={searchVendor}
                                                onChange={e => {
                                                    var newVendors = e.map(a => {
                                                        var alreadyExists = productVendorInfos.find(b => (b.value === a.value));
                                                        if(alreadyExists){
                                                            return alreadyExists;
                                                        }
                                                        return{
                                                            label: a.label,
                                                            value: a.value,
                                                            price: 0,
                                                            discount: 0,
                                                            cartDiscount: 0,
                                                            vendorReference: "/Vendors/" + a.value,
                                                            paymentOptions: []
                                                        }
                                                    });
                                                    setProductVendorInfos(newVendors);
                                                }}
                                            />
                                        }
                                        
                                        {
                                            productVendorInfos.map((vendor, vendorIndex) =>{
                                                return (
                                                    <CCard key={vendorIndex} borderColor="danger">
                                                        <CCardHeader>
                                                            <div className="d-flex justify-content-between">
                                                                <Link to={"/vendors/"+vendor.value}>
                                                                    <span>{vendor.label}</span>
                                                                </Link>
                                                            </div>
                                                        </CCardHeader>
                                                        <CCardBody>
                                                            <CRow>
                                                                <CCol>
                                                                    <CFormGroup className="mb-4">
                                                                        <CLabel>Price</CLabel>
                                                                        <CInputGroup>
                                                                            <CInputGroupPrepend>
                                                                                <CInputGroupText>
                                                                                    <i className="fal fa-dollar-sign" />
                                                                                </CInputGroupText>
                                                                            </CInputGroupPrepend>
                                                                            <CInput 
                                                                                type="number" 
                                                                                placeholder="Product Actual Price" 
                                                                                autoComplete="price" 
                                                                                name="price"
                                                                                value={vendor.price}
                                                                                onChange={(e)=>{
                                                                                    var value = e.target.value < 0 ? 0 : e.target.value;
                                                                                    var newVendors = productVendorInfos.map(a => {
                                                                                        if(a.value === vendor.value){
                                                                                            return {
                                                                                                ...a,
                                                                                                price: value
                                                                                            }
                                                                                        }
                                                                                        return a;
                                                                                    });
                                                                                    setProductVendorInfos(newVendors)
                                                                                }}
                                                                                required
                                                                                min="0"
                                                                                step="any"
                                                                            />
                                                                        </CInputGroup>
                                                                    </CFormGroup>
                                                                    <CRow className="mb-4">
                                                                        <CCol>
                                                                            <CFormGroup>
                                                                                <CLabel>Discount</CLabel>
                                                                                <CInputGroup>
                                                                                    <CInputGroupPrepend>
                                                                                        <CInputGroupText>
                                                                                            <i className="fal fa-percent" />
                                                                                        </CInputGroupText>
                                                                                    </CInputGroupPrepend>
                                                                                    <CInput 
                                                                                        type="number" 
                                                                                        placeholder="Product Discount" 
                                                                                        autoComplete="discount" 
                                                                                        name="discount"
                                                                                        value={vendor.discount}
                                                                                        onChange={(e)=>{
                                                                                            var value = e.target.value > 100 ? 100 : e.target.value;
                                                                                            var newVendors = productVendorInfos.map(a => {
                                                                                                if(a.value === vendor.value){
                                                                                                    return {
                                                                                                        ...a,
                                                                                                        discount: value
                                                                                                    }
                                                                                                }
                                                                                                return a;
                                                                                            });
                                                                                            setProductVendorInfos(newVendors)
                                                                                        }}
                                                                                        required
                                                                                        min="0"
                                                                                        max="100"
                                                                                        step="any"
                                                                                    />
                                                                                </CInputGroup>
                                                                            </CFormGroup>
                                                                        </CCol>
                                                                        <CCol>
                                                                            <CFormGroup>
                                                                                <CLabel>Cart Discount</CLabel>
                                                                                <CInputGroup>
                                                                                    <CInputGroupPrepend>
                                                                                        <CInputGroupText>
                                                                                            <i className="fal fa-percent" />
                                                                                        </CInputGroupText>
                                                                                    </CInputGroupPrepend>
                                                                                    <CInput 
                                                                                        type="number" 
                                                                                        placeholder="Product Cart Discount" 
                                                                                        autoComplete="cartDiscount"
                                                                                        name="cartDiscount"
                                                                                        value={vendor.cartDiscount}
                                                                                        onChange={(e)=>{
                                                                                            var value = e.target.value > 100 ? 100 : e.target.value;
                                                                                            var newVendors = productVendorInfos.map(a => {
                                                                                                if(a.value === vendor.value){
                                                                                                    return {
                                                                                                        ...a,
                                                                                                        cartDiscount: value
                                                                                                    }
                                                                                                }
                                                                                                return a;
                                                                                            });
                                                                                            setProductVendorInfos(newVendors)
                                                                                        }}
                                                                                        required
                                                                                        min="0"
                                                                                        max="100"
                                                                                        step="any"
                                                                                    />
                                                                                </CInputGroup>
                                                                            </CFormGroup>
                                                                        </CCol>
                                                                    </CRow>
                                                                </CCol>
                                                            </CRow>
                                                            
                                                            <CRow className="mt-4">
                                                                <CCol>
                                                                    <CCard>
                                                                        <CCardHeader>
                                                                            Payment Options
                                                                        </CCardHeader>
                                                                        <CCardBody>
                                                                            <Select
                                                                                className="flex mb-4"
                                                                                isMulti
                                                                                isClearable={true}
                                                                                isSearchable={true}
                                                                                value={
                                                                                    vendor.paymentOptions.map(e => {
                                                                                        return {
                                                                                            label: e.label,
                                                                                            value: e.value
                                                                                        }
                                                                                    })
                                                                                }
                                                                                options={cardSelectOptions}
                                                                                onInputChange={searchCard}
                                                                                onChange={e => {
                                                                                    var newPaymentMethods = e.map(a => {
                                                                                        var alreadyExists = vendor.paymentOptions.findIndex(b => (b.value === a.value));
                                                                                        if(alreadyExists !== -1){
                                                                                            return vendor.paymentOptions[alreadyExists];
                                                                                        }
                                                                                        return{
                                                                                            label: a.label,
                                                                                            value: a.value,
                                                                                            cardReference: "/Cards/" + a.value,
                                                                                            installments: []
                                                                                        }
                                                                                    });
                                                                                    setProductVendorInfos(
                                                                                        productVendorInfos.map(e => {
                                                                                            if(e.vendorReference === vendor.vendorReference){
                                                                                                return{
                                                                                                    ...e,
                                                                                                    paymentOptions: newPaymentMethods
                                                                                                }
                                                                                            }
                                                                                            return e;
                                                                                        })
                                                                                    );
                                                                                }}
                                                                            />

                                                                            {
                                                                                vendor.paymentOptions.map((payment, paymentIndex) => {
                                                                                    return(
                                                                                        <CCard key={paymentIndex} borderColor="info">
                                                                                            <CCardHeader>
                                                                                                <div className="d-flex justify-content-between">
                                                                                                    <Link to={"/cards/"+payment.value}>
                                                                                                        <span>{payment.label}</span>
                                                                                                    </Link>
                                                                                                </div>
                                                                                            </CCardHeader>
                                                                                            <CCardBody>
                                                                                                <CDataTable
                                                                                                    items={payment.installments}
                                                                                                    fields={['month','amount','remove']}
                                                                                                    dark
                                                                                                    hover
                                                                                                    striped
                                                                                                    bordered
                                                                                                    size="sm"
                                                                                                    scopedSlots = {{
                                                                                                        'remove':
                                                                                                        (item)=>(
                                                                                                        <td style={{width: 50}}>
                                                                                                            <CButton color="danger"
                                                                                                            onClick={e => {
                                                                                                                let newVendors = productVendorInfos;
                                                                                                                let installments = newVendors[vendorIndex].paymentOptions[paymentIndex].installments;
                                                                                                                var alreadyExistsIndex = installments.findIndex(a => a.month === item.month);
                                                                                                                if(alreadyExistsIndex !== -1){
                                                                                                                    installments.splice(alreadyExistsIndex, 1)
                                                                                                                    setProductVendorInfos(newVendors)
                                                                                                                }
                                                                                                            }}
                                                                                                            >
                                                                                                                <i className="fal fa-trash"></i>
                                                                                                            </CButton>
                                                                                                        </td>
                                                                                                        )
                                                                                                    }}
                                                                                                />
                                                                                                <CRow>
                                                                                                    <CCol xs="12" md="6">
                                                                                                        <CFormGroup>
                                                                                                            <CLabel>Month</CLabel>
                                                                                                            <CInputGroup>
                                                                                                                <CInputGroupPrepend>
                                                                                                                    <CInputGroupText>
                                                                                                                        <CIcon name="cil-layers" />
                                                                                                                    </CInputGroupText>
                                                                                                                </CInputGroupPrepend>
                                                                                                                <CInput 
                                                                                                                    type="number" 
                                                                                                                    placeholder="Month" 
                                                                                                                    autoComplete="month" 
                                                                                                                    name="month"
                                                                                                                    value={addInstallmentValues.month}
                                                                                                                    onChange={e => {
                                                                                                                        var value = e.target.value < 0 ? 0 : e.target.value;
                                                                                                                        setAddInstallmentValues(prev => ({
                                                                                                                            ...prev,
                                                                                                                            month: value
                                                                                                                        }))
                                                                                                                    }}
                                                                                                                />
                                                                                                            </CInputGroup>
                                                                                                        </CFormGroup>
                                                                                                    </CCol>
                                                                                                    <CCol xs="12" md="6">
                                                                                                        <CFormGroup>
                                                                                                            <CLabel>Amount</CLabel>
                                                                                                            <CInputGroup>
                                                                                                                <CInputGroupPrepend>
                                                                                                                    <CInputGroupText>
                                                                                                                        <CIcon name="cil-layers" />
                                                                                                                    </CInputGroupText>
                                                                                                                </CInputGroupPrepend>
                                                                                                                <CInput
                                                                                                                    type="number"
                                                                                                                    placeholder="Amount" 
                                                                                                                    autoComplete="amount" 
                                                                                                                    name="amount"
                                                                                                                    value={addInstallmentValues.amount}
                                                                                                                    onChange={e => {
                                                                                                                        var value = e.target.value < 0 ? 0 : e.target.value;
                                                                                                                        setAddInstallmentValues(prev => ({
                                                                                                                            ...prev,
                                                                                                                            amount: value
                                                                                                                        }))
                                                                                                                    }}
                                                                                                                />
                                                                                                            </CInputGroup>
                                                                                                        </CFormGroup>
                                                                                                    </CCol>
                                                                                                </CRow>
                                                                                                <div className="d-flex justify-content-end">
                                                                                                    <CButton type="button" shape="pill" color="success"
                                                                                                        onClick={(event => {
                                                                                                            event.preventDefault();
                                                                                                            var month = addInstallmentValues.month;
                                                                                                            var amount = addInstallmentValues.amount;
                                                                                                            if(month !== 0 && amount !== 0){
                                                                                                                let newVendors = productVendorInfos;
                                                                                                                let installments = newVendors[vendorIndex].paymentOptions[paymentIndex].installments;
                                                                                                                var alreadyExistsIndex = installments.findIndex(a => a.month === month);
                                                                                                                if(alreadyExistsIndex === -1){
                                                                                                                    installments.push({month: month, amount: amount});
                                                                                                                }else{
                                                                                                                    installments[alreadyExistsIndex].amount = amount;
                                                                                                                }
                                                                                                                setProductVendorInfos(newVendors);
                                                                                                                setAddInstallmentValues(addInstallmentValuesInitial);
                                                                                                            }
                                                                                                        })}
                                                                                                    >
                                                                                                    Add installment
                                                                                                    </CButton>
                                                                                                </div>

                                                                                            </CCardBody>
                                                                                        </CCard>
                                                                                    )
                                                                                })
                                                                            }

                                                                        </CCardBody>
                                                                    </CCard>
                                                                </CCol>
                                                            </CRow>
                                                        </CCardBody>
                                                    </CCard>
                                                );
                                            })
                                        }
                                        <div className="d-flex justify-content-end">
                                            <CButton onClick={handleUpdateVendorsSubmit} block shape="pill" color="danger" className="mt-4">Update Vendors</CButton>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CTabPane>
                        </CTabContent>
                        </CTabs>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Product