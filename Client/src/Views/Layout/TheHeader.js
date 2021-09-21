import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

// routes config
import routes from '../../routes'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const logOut = () => {
    const requestOptions = {
      method: 'POST'
    };
    fetch('http://localhost:4000/auth/logout', requestOptions)
      .then(response =>response.json())
      .then(data => {
        if(data.isSuccessful){
          dispatch({type: 'set', isAuthenticated: false });
        }
      });
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-1" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-1">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-1">
          <CHeaderNavLink to="/products">Products</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-1">
          <CHeaderNavLink to="/brands">Brands</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-1">
          <CHeaderNavLink to="/vendors">Vendors</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-1">
          <CHeaderNavLink to="/cards">Payment Cards</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <CButton color="danger" onClick = {logOut}>
          <i className="fal fa-sign-out-alt mfe-2" />Exit
        </CButton>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
