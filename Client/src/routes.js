import React from 'react';

const Dashboard = React.lazy(() => import('./Views/Dashboard/Dashboard'));

const Users = React.lazy(() => import('./Views/Dashboard/Users'));
const User = React.lazy(() => import('./Views/Dashboard/User'));

const Products = React.lazy(() => import('./Views/Dashboard/Products'));
const Product = React.lazy(() => import('./Views/Dashboard/Product'));
const ProductAdd = React.lazy(() => import('./Views/Dashboard/ProductAdd'));

const Brands = React.lazy(() => import('./Views/Dashboard/Brands'));
const Brand = React.lazy(() => import('./Views/Dashboard/Brand'));
const BrandAdd = React.lazy(() => import('./Views/Dashboard/BrandAdd'));

const Vendors = React.lazy(() => import('./Views/Dashboard/Vendors'));
const Vendor = React.lazy(() => import('./Views/Dashboard/Vendor'));
const VendorAdd = React.lazy(() => import('./Views/Dashboard/VendorAdd'));

const Cards = React.lazy(() => import('./Views/Dashboard/Cards'));
const Card = React.lazy(() => import('./Views/Dashboard/Card'));
const CardAdd = React.lazy(() => import('./Views/Dashboard/CardAdd'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/products', exact: true, name: 'Products', component: Products},
  { path: '/products/:id', exact: true, name: 'Product Details', component: Product},
  { path: '/product_add', name: 'Product Add', component: ProductAdd},
  { path: '/brands', exact: true, name: 'Brands', component: Brands},
  { path: '/brands/:id', exact: true, name: 'Brand Details', component: Brand},
  { path: '/brand_add', name: 'Brand Add', component: BrandAdd},
  { path: '/vendors', exact: true, name: 'Vendors', component: Vendors},
  { path: '/vendors/:id', exact: true, name: 'Vendor Details', component: Vendor},
  { path: '/vendor_add', name: 'Vendor Add', component: VendorAdd},
  { path: '/cards', exact: true, name: 'Cards', component: Cards},
  { path: '/cards/:id', exact: true, name: 'Card Details', component: Card},
  { path: '/card_add', name: 'Card Add', component: CardAdd},
];

export default routes;
