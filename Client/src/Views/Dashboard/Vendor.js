import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
    CAlert,
    CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { GetVendor, updateVendorInfos } from '../../api_service';

const alertSeconds = 10;
const initialFormValues = {
    name: "",
    email: "",
    city: "",
    contact: ""
};

const Vendor = () => {
    const { id } = useParams();

    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
        GetVendor(id).then(data => {
            if(data.isSuccess){
                setFormValues({
                    name: data.data._fieldsProto.name.stringValue,
                    email: data.data._fieldsProto.email.stringValue,
                    city: data.data._fieldsProto.city.stringValue,
                    contact: data.data._fieldsProto.contact.stringValue,
                })
            }
        })
    }, [id])

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        updateVendorInfos(id, formValues).then(data => {
            if(data.isSuccess){
                setAlertMessage("Successfully! Vendor updated.");
                setOpenSuccessAlert(alertSeconds);
            }else{
                setAlertMessage("Error when vendor updates!");
                setOpenErrorAlert(alertSeconds);
            }
        })
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
                            Vendor Basic Infos
                        </CCardHeader>
                        <CCardBody>
                            <CFormGroup className="mb-4">
                                <CLabel>Vendor Name</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Vendor Name" 
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
                                <CLabel>Vendor E-Mail</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Vendor E-Mail" 
                                        autoComplete="email" 
                                        name="email"
                                        value={formValues.email}
                                        onChange={(e)=>{
                                            setFormValues({
                                                ...formValues,
                                                email: e.target.value
                                            });
                                        }}
                                        required
                                    />
                                </CInputGroup>
                            </CFormGroup>
                            <CFormGroup className="mb-4">
                                <CLabel>Vendor City</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Vendor City" 
                                        autoComplete="city" 
                                        name="city"
                                        value={formValues.city}
                                        onChange={(e)=>{
                                            setFormValues({
                                                ...formValues,
                                                city: e.target.value
                                            });
                                        }}
                                        required
                                    />
                                </CInputGroup>
                            </CFormGroup>
                            <CFormGroup className="mb-4">
                                <CLabel>Vendor Contact</CLabel>
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-layers" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput 
                                        type="text" 
                                        placeholder="Vendor Contact" 
                                        autoComplete="contact" 
                                        name="contact"
                                        value={formValues.contact}
                                        onChange={(e)=>{
                                            setFormValues({
                                                ...formValues,
                                                contact: e.target.value
                                            });
                                        }}
                                    />
                                </CInputGroup>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                
                <CCol>
                    <CButton type="submit" block shape="pill" color="danger" className="mt-2">Update Vendor</CButton>
                </CCol>
            </CRow>
        </CForm>
    );
}

export default Vendor