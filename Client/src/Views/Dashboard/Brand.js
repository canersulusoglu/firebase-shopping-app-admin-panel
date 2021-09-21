import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    CCol, 
    CRow,
    CAlert,
    CProgress,
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
    CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ImageUploading from 'react-images-uploading';
import { GetBrand, GetBrandLogo, updateBrandInfos, updateBrandLogo } from '../../api_service'

const alertSeconds = 10;
const initialBrandValues = {
    brandId: "",
    name: "",
    website: ""
};

const Brand = (props) => {
    const { id } = useParams();

    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [brandValues, setBrandValues] = useState(initialBrandValues);
    const [brandLogo, setBrandLogo] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        GetBrand(id).then(data => {
            if(data.isSuccess){
                setBrandValues({
                    brandId: data.data._ref._path.segments.lastItem,
                    name: data.data._fieldsProto.name.stringValue,
                    website: data.data._fieldsProto.website.stringValue,
                });

                GetBrandLogo(id).then(brandLogoData => {
                    if(brandLogoData.isSuccess){
                        setBrandLogo(brandLogoData.data);
                    }
                })
            }
        })
    }, [id]);

    const handeFormSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        var brandData = {
            name: brandValues.name,
            website: brandValues.website
        }
        updateBrandInfos(id, brandData).then(data =>{
            if(data.isSuccess){
                setAlertMessage("Successfully! Brand infos updated.");
                setOpenSuccessAlert(alertSeconds);
            }else{
                setAlertMessage("Error when brand infos update!");
                setOpenErrorAlert(alertSeconds);
            }
        })
    }

    const handleChangeLogoSubmit = () => {
        if(images.length === 1){
            var imageData = {
                data_url: images[0].data_url,
                name: images[0].file.name,
                type: images[0].file.type,
                size: images[0].file.size
            }
            updateBrandLogo(id, imageData).then(data => {
                if(data.isSuccess){
                    setAlertMessage("Successfully! Brand logo updated.");
                    setOpenSuccessAlert(alertSeconds);
                    GetBrandLogo(id).then(brandLogoData => {
                        if(brandLogoData.isSuccess){
                            setBrandLogo(brandLogoData.data);
                        }
                    });
                }else{
                    setAlertMessage("Error when brand logo updates!");
                    setOpenErrorAlert(alertSeconds);
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

            <CCol xs="12" md="12" sm="12">
                <CCard className="mt-4">
                    <CCardHeader>
                        Brand Basic Infos
                    </CCardHeader>
                    <CCardBody>
                        <CForm
                            onSubmit={handeFormSubmit}
                        >
                            <CFormGroup className="mb-4">
                                <CLabel htmlFor="nf-email">Brand Name</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Brand Name" 
                                        autoComplete="name" 
                                        name="name"
                                        value={brandValues.name}
                                        onChange={(e)=>{
                                            setBrandValues({
                                                ...brandValues,
                                                name: e.target.value
                                            });
                                        }}
                                        required
                                    />
                                </CInputGroup>
                            </CFormGroup>

                            <CFormGroup className="mb-4">
                                <CLabel htmlFor="nf-email">Brand Website</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Brand Website" 
                                        autoComplete="website" 
                                        name="website"
                                        value={brandValues.website}
                                        onChange={(e)=>{
                                            setBrandValues({
                                                ...brandValues,
                                                website: e.target.value
                                            });
                                        }}
                                        required
                                    />
                                </CInputGroup>
                            </CFormGroup>

                            <div className="d-flex justify-content-end">
                                <CButton type="submit"shape="pill" color="danger" className="mt-4">Change Infos</CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol>
                <CCard>
                    <CCardHeader>
                        Brand Logo
                    </CCardHeader>
                    <CCardBody>
                        {
                            brandLogo.map((e, i) => {
                                return(
                                    <CCard key={i} borderColor="danger">
                                        <CCardHeader className="text-center">
                                            {e.name}
                                        </CCardHeader>
                                        <CCardBody className="d-flex justify-content-center">
                                            <img style={{width:200}} src={e.url} alt={e.name}></img>
                                        </CCardBody>
                                    </CCard>  
                                )
                            })
                        }

                        <ImageUploading
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
                        <CButton onClick={handleChangeLogoSubmit} block shape="pill" color="danger" className="mt-4">Change Logo</CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Brand