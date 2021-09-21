import React from 'react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <i className="fal fa-tachometer-alt c-sidebar-nav-icon"/>,
    badge: {
      color: 'success',
      text: 'Home',
    }
  },

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Users']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <i className="fal fa-users c-sidebar-nav-icon"/>,
  },  

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Product']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Products',
    to: '/products',
    icon: <i className="fal fa-warehouse-alt c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Product Add',
    to: '/product_add',
    icon: <i className="fal fa-truck-loading c-sidebar-nav-icon"/>,
  },

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Brands']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Brands',
    to: '/brands',
    icon: <i className="fal fa-copyright c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Brand Add',
    to: '/brand_add',
    icon: <i className="fal fa-copyright c-sidebar-nav-icon"/>,
  },

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Vendors']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vendors',
    to: '/vendors',
    icon: <i className="fal fa-people-carry c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vendor Add',
    to: '/vendor_add',
    icon: <i className="fal fa-person-dolly c-sidebar-nav-icon"/>,
  },

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Payment Cards']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Cards',
    to: '/cards',
    icon: <i className="fal fa-credit-card c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Card Add',
    to: '/card_add',
    icon: <i className="fal fa-credit-card c-sidebar-nav-icon"/>,
  },
]

export default _nav
