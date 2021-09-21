import React from 'react'
import { 
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';


const User = () => {
  return (
    <CRow>
        <CCol xs="12" sm="12" md="12" lg="12" xl="12">
            <CCard>
                <CCardHeader>
                    User
                </CCardHeader>
                <CCardBody>
                    ...
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
  )
}

export default User
