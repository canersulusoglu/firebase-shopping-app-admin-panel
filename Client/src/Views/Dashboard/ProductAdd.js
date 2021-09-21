import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CFormGroup,
    CLabel,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInput,
    CButton,
    CInvalidFeedback,
    CDataTable,
    CAlert,
    CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import Select from 'react-select'
import { KeyValue } from 'react-key-value'
import ImageUploading from 'react-images-uploading';
import { getAllCategories } from '../../constants'
import {
    searchBrands,
    searchVendors,
    searchCards,
    addProduct
} from '../../api_service'

var categoriesSelect = getAllCategories().map(e => {
    return{
        value: e.id,
        label: e.name
    }
});

const alertSeconds = 10;

const initialFormValues = {
    name: "",
    categoryIds: [],
    brandReference: "",
    features: {},
    vendors: []
}

const addInstallmentValuesInitial = {
    month: "",
    amount: ""
}

const ProductAdd = () => {
    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [formValues, setFormValues] = useState(initialFormValues);
    const [images, setImages] = useState([]);

    const [categorieSelectValidated, setCategorieSelectValidated] = useState(false);

    const [brandSelectValidated, setBrandSelectValidated] = useState(false);
    const [brandSelectOptions, setBrandSelectOptions] = useState();

    const [vendorSelectOptions, setVendorSelectOptions] = useState();
    const [cardSelectOptions, setCardSelectOptions] = useState();

    const [addInstallmentValues, setAddInstallmentValues] = useState(addInstallmentValuesInitial)

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        if(categorieSelectValidated && brandSelectValidated){
            var actualData = {
                ...formValues,
                vendors: formValues.vendors.map(e => {
                    return{
                        price: e.price,
                        discount: e.discount,
                        cartDiscount: e.cartDiscount,
                        vendorReference: e.vendorReference,
                        paymentOptions: e.paymentOptions.map(a => {
                            return{
                                cardReference: a.cardReference,
                                installments: a.installments
                            }
                        })
                    }
                })
            }
            var imagesData = images.map(e => {
                return {
                    data_url: e.data_url,
                    name: e.file.name,
                    type: e.file.type,
                    size: e.file.size
                }
            })

            addProduct(actualData, imagesData).then(data => {
                if(data.isSuccess){
                    setAlertMessage("Successfully! Product added.");
                    setOpenSuccessAlert(alertSeconds);
                    setFormValues(initialFormValues);
                    setImages([]);
                    setBrandSelectOptions();
                    setVendorSelectOptions();
                    setCardSelectOptions();
                    setAddInstallmentValues(addInstallmentValuesInitial);
                }else{
                    setAlertMessage("Error when product adds!");
                    setOpenErrorAlert(alertSeconds);
                }
            });

        }
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

            <CForm
                onSubmit={handleFormSubmit}
            >
                <CRow>
                    <CCol xs="12" md="12" sm="12">
                        <CCard>
                            <CCardHeader>
                                Product Basic Infos
                            </CCardHeader>
                            <CCardBody>
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
                                            value={formValues.name}
                                            onChange={(e)=>{
                                                setFormValues({
                                                    ...formValues,
                                                    name: e.target.value
                                                });
                                            }}
                                            required
                                        />
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup className="mb-4">
                                    <CLabel>Categories</CLabel>
                                    <Select 
                                        invalid id="inputIsInvalid" 
                                        className="flex"
                                        isMulti
                                        isClearable={true}
                                        isSearchable={true}
                                        options={categoriesSelect}
                                        onChange={(e) => {
                                            if(e.length === 0){
                                                setCategorieSelectValidated(false);
                                            }else{
                                                setCategorieSelectValidated(true);
                                            }
                                            setFormValues({
                                                ...formValues,
                                                categoryIds: e.map(a => a.value),
                                            });
                                        }}
                                    />
                                    {
                                        (!categorieSelectValidated) ?
                                        <CInvalidFeedback className="d-block">
                                            At least 1 category must be selected.
                                        </CInvalidFeedback>
                                        : null
                                    }
                                </CFormGroup>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol xs="12" md="12" sm="12">
                        <CCard>
                            <CCardHeader>
                                Product Pictures
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
                                                type="button"
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
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol xs="12" md="12" sm="12">
                        <CCard>
                            <CCardHeader>
                                Features
                            </CCardHeader>
                            <CCardBody>
                                <KeyValue
                                    customAddButtonRenderer={ (handleAddNew) => (
                                        <div>
                                            <CButton onClick={ handleAddNew } type="button" block shape="pill" color="primary" className="mt-4">+ Add</CButton>
                                        </div>
                                    ) }
                                    onChange={ (rows) => {
                                        const keys = rows.map(e => e.keyItem);
                                        const values = rows.map(e => e.valueItem);
                                        const data = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
                                        let actualData = Object.fromEntries(Object.entries(data).filter(([k, v]) => v !== "" && k !== " "));
                                        setFormValues({
                                            ...formValues,
                                            features: actualData
                                        });
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                    
                    <CCol xs="12" md="12" sm="12">
                        <CCard>
                            <CCardHeader>
                                Brand
                            </CCardHeader>
                            <CCardBody>
                                <Select
                                    className="flex"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={brandSelectOptions}
                                    onInputChange={searchBrand}
                                    onChange={(e)=>{
                                        if(e === null){
                                            setBrandSelectValidated(false);
                                        }else{
                                            setFormValues({
                                                ...formValues,
                                                brandReference: "/Brands/" + e.value
                                            });
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
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol xs="12" md="12" sm="12">
                        <CCard>
                            <CCardHeader>
                                Vendors
                            </CCardHeader>
                            <CCardBody>
                                <Select
                                    className="flex mb-4"
                                    isMulti
                                    isClearable={true}
                                    isSearchable={true}
                                    options={vendorSelectOptions}
                                    onInputChange={searchVendor}
                                    onChange={e => {
                                        var newVendors = e.map(a => {
                                            var alreadyExists = formValues.vendors.find(b => (b.value === a.value));
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
                                        setFormValues({
                                            ...formValues,
                                            vendors: newVendors
                                        });
                                    }}
                                />

                                {
                                    formValues.vendors.map((vendor, vendorIndex) =>{
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
                                                                            var newVendors = formValues.vendors.map(a => {
                                                                                if(a.value === vendor.value){
                                                                                    return {
                                                                                        ...a,
                                                                                        price: value
                                                                                    }
                                                                                }
                                                                                return a;
                                                                            });
                                                                            setFormValues({
                                                                                ...formValues,
                                                                                vendors: newVendors
                                                                            })
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
                                                                                    var newVendors = formValues.vendors.map(a => {
                                                                                        if(a.value === vendor.value){
                                                                                            return {
                                                                                                ...a,
                                                                                                discount: value
                                                                                            }
                                                                                        }
                                                                                        return a;
                                                                                    });
                                                                                    setFormValues({
                                                                                        ...formValues,
                                                                                        vendors: newVendors
                                                                                    })
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
                                                                                    var newVendors = formValues.vendors.map(a => {
                                                                                        if(a.value === vendor.value){
                                                                                            return {
                                                                                                ...a,
                                                                                                cartDiscount: value
                                                                                            }
                                                                                        }
                                                                                        return a;
                                                                                    });
                                                                                    setFormValues({
                                                                                        ...formValues,
                                                                                        vendors: newVendors
                                                                                    })
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
                                                                            setFormValues({
                                                                                ...formValues,
                                                                                vendors: formValues.vendors.map(e => {
                                                                                    if(e.vendorReference === vendor.vendorReference){
                                                                                        return{
                                                                                            ...e,
                                                                                            paymentOptions: newPaymentMethods
                                                                                        }
                                                                                    }
                                                                                    return e;
                                                                                })
                                                                            });
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
                                                                                                        let newVendors = [...formValues.vendors];
                                                                                                        let installments = newVendors[vendorIndex].paymentOptions[paymentIndex].installments;
                                                                                                        var alreadyExistsIndex = installments.findIndex(a => a.month === item.month);
                                                                                                        if(alreadyExistsIndex !== -1){
                                                                                                            installments.splice(alreadyExistsIndex, 1)
                                                                                                            setFormValues({
                                                                                                                ...formValues,
                                                                                                                vendors: newVendors
                                                                                                            })
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
                                                                                                        let newVendors = [...formValues.vendors];
                                                                                                        let installments = newVendors[vendorIndex].paymentOptions[paymentIndex].installments;
                                                                                                        var alreadyExistsIndex = installments.findIndex(a => a.month === month);
                                                                                                        if(alreadyExistsIndex === -1){
                                                                                                            installments.push({month: month, amount: amount});
                                                                                                        }else{
                                                                                                            installments[alreadyExistsIndex].amount = amount;
                                                                                                        }
                                                                                                        setFormValues({
                                                                                                            ...formValues,
                                                                                                            vendors: newVendors
                                                                                                        });
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
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol>
                        <CButton type="submit" block shape="pill" color="danger" className="mt-2">Add Product</CButton>
                    </CCol>
                </CRow>
            </CForm>
        </CRow>
    );
}

export default ProductAdd