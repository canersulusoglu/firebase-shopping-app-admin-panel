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
    CAlert,
    CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { addVendor } from '../../api_service';

const alertSeconds = 10;

const initialFormValues = {
    name: "",
    email: "",
    city: "",
    contact: ""
};

const VendorAdd = () => {
    const [openSuccessAlert, setOpenSuccessAlert] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const [formValues, setFormValues] = useState(initialFormValues);

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        addVendor(formValues).then(data => {
            if(data.isSuccess){
                setAlertMessage("Successfully! Vendor added.");
                setOpenSuccessAlert(alertSeconds);
                setFormValues(initialFormValues);
            }else{
                setAlertMessage("Error when vendor adds!");
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
                    <CButton type="submit" block shape="pill" color="danger" className="mt-2">Add Vendor</CButton>
                </CCol>
            </CRow>
        </CForm>
    );
}

export default VendorAdd