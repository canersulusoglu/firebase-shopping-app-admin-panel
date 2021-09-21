import React, { useState } from 'react'
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
    CAlert,
    CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import ImageUploading from 'react-images-uploading';
import { addCard } from '../../api_service'

const alertSeconds = 10;

const initialFormValues = {
    name: ""
}

const CardAdd = () => {
    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [formValues, setFormValues] = useState(initialFormValues);
    const [images, setImages] = useState([]);

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        if(images.length === 1){
            var imageData = {
                data_url: images[0].data_url,
                name: images[0].file.name,
                type: images[0].file.type,
                size: images[0].file.size
            }
            addCard(formValues, imageData).then(data =>{
                if(data.isSuccess){
                    setAlertMessage("Successfully! Card added.");
                    setOpenSuccessAlert(alertSeconds);
                    setFormValues(initialFormValues);
                    setImages([]);
                }else{
                    setAlertMessage("Error when card adds!");
                    setOpenErrorAlert(alertSeconds);
                }
            })
        }
    }

    return(
        <CForm
            onSubmit={handleFormSubmit}
        >
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
                    <CCard>
                        <CCardHeader>
                            Card Basic Infos
                        </CCardHeader>
                        <CCardBody>
                            <CFormGroup className="mb-4">
                                <CLabel>Card Name</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Card Name" 
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
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xs="12" md="12" sm="12">
                    <CCard>
                        <CCardHeader>
                            Card Image
                            {
                                (images.length === 0) ?
                                <CInvalidFeedback className="d-block">
                                    Card image must be select!
                                </CInvalidFeedback>
                                : null
                            }
                        </CCardHeader>
                        <CCardBody>
                            <ImageUploading
                                required       
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
                
                <CCol>
                    <CButton type="submit" block shape="pill" color="danger" className="mt-2">Add Card</CButton>
                </CCol>
            </CRow>
        </CForm>
    );
}

export default CardAdd