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
import { 
    GetCard, 
    GetCardImage, 
    updateCardInfos, 
    updateCardImage 
} from '../../api_service'

const alertSeconds = 10;
const initialCardValues = {
    cardId: "",
    name: ""
};

const Card = (props) => {
    const { id } = useParams();

    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [cardValues, setCardValues] = useState(initialCardValues);
    const [cardImage, setCardImage] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        GetCard(id).then(data => {
            if(data.isSuccess){
                setCardValues({
                    cardId: data.data._ref._path.segments.lastItem,
                    name: data.data._fieldsProto.name.stringValue
                });

                GetCardImage(id).then(cardImageData => {
                    if(cardImageData.isSuccess){
                        setCardImage(cardImageData.data);
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

        var cardData = {
            name: cardValues.name
        }
        updateCardInfos(id, cardData).then(data =>{
            if(data.isSuccess){
                setAlertMessage("Successfully! Card infos updated.");
                setOpenSuccessAlert(alertSeconds);
            }else{
                setAlertMessage("Error when card infos update!");
                setOpenErrorAlert(alertSeconds);
            }
        })
    }

    const handleChangeImageSubmit = () => {
        if(images.length === 1){
            var imageData = {
                data_url: images[0].data_url,
                name: images[0].file.name,
                type: images[0].file.type,
                size: images[0].file.size
            }
            updateCardImage(id, imageData).then(data => {
                if(data.isSuccess){
                    setAlertMessage("Successfully! Card image updated.");
                    setOpenSuccessAlert(alertSeconds);
                    GetCardImage(id).then(cardImageData => {
                        if(cardImageData.isSuccess){
                            setCardImage(cardImageData.data);
                        }
                    });
                }else{
                    setAlertMessage("Error when card image updates!");
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
                        Card Basic Infos
                    </CCardHeader>
                    <CCardBody>
                        <CForm
                            onSubmit={handeFormSubmit}
                        >
                            <CFormGroup className="mb-4">
                                <CLabel htmlFor="nf-email">Card Name</CLabel>
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
                                        value={cardValues.name}
                                        onChange={(e)=>{
                                            setCardValues({
                                                ...cardValues,
                                                name: e.target.value
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
                        Card Image
                    </CCardHeader>
                    <CCardBody>
                        {
                            cardImage.map((e, i) => {
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
                        <CButton onClick={handleChangeImageSubmit} block shape="pill" color="danger" className="mt-4">Change Image</CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Card