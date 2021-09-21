import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { LoginApiService } from '../../api_service';

const Login = () => {
  const dispatch = useDispatch();

  const [validated, setvalidated] = useState(false);
  const [loginError, setloginError] = useState(false);

  const handleSubmit = (event) =>{
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setvalidated(true);
    var username = event.currentTarget.username.value;
    var password = event.currentTarget.password.value;

    LoginApiService(username, password).then(data =>{
      if(data.isSuccessful){
        setloginError(false);
        dispatch({type: 'set', isAuthenticated: true });
      }else{
        setloginError(true);
      }
    });
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {
                    (loginError) ?
                    <CAlert color="danger">
                      Username or password is not correct!
                    </CAlert>
                    : null
                  }
                  <CForm
                    wasValidated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to admin panel</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" name="username" required/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" name="password" required/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Admin Panel</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
