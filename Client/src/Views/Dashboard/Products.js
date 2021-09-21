
import React, { useEffect, useState} from 'react'
import { 
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CDataTable,
    CBadge,
    CButton,
    CLink,
    CFormGroup,
    CLabel,
    CInputGroup,
    CInput,
    CInputGroupPrepend,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CPagination
} from '@coreui/react';
import { 
    GetProducts,
    searchProducts
} from '../../api_service'
import { categorieListFind } from '../../constants'

const searchByOptions = [
    'name',
    'productId'
]


const Products = () => {
    const [searchBy, setSearchBy] = useState(searchByOptions[0]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [products, setProducts] : [] = useState([]);

    const limit = 10;
    const fields = [
        'productId',
        'brandId',
        'name',
        'categoryNames',
        'vendorCount',
        'goDetail'
    ];

    useEffect(() => {
        var offset = (pageNumber - 1) * limit;
        GetProducts(limit, offset).then(data => {
            if(data.isSuccess){
                var actualData = data.data.map(e => {
                    return {
                        productId: e.id,
                        brandId: e.data.brandReference._path.segments.lastItem,
                        name: e.data.name,
                        categoryIds: e.data.categoryIds,
                        vendors: e.data.vendors
                    }
                });
                var totalProductCount = data.totalProductCount;
                var pageCount = Math.ceil((totalProductCount / limit));
                setTotalPageCount(pageCount);
                setProducts(actualData);
            }
        });
    }, [pageNumber])

    const searchProduct = (e) =>{
        var value = e.target.value;
        if(value.length >= 3){
            searchProducts(value, searchBy).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e => {
                        return {
                            productId: e._ref._path.segments.lastItem,
                            name: e._fieldsProto.name.stringValue,
                            categoryIds: e._fieldsProto.categoryIds.arrayValue.values.map(e => e.stringValue),
                            vendors: e._fieldsProto.vendors.arrayValue.values,
                            brandId: e._fieldsProto.brandReference.referenceValue.split('/').lastItem
                        }
                    });
                    setProducts(actualData);
                }else{
                    setProducts([]);
                }
            })
        }
    }

    return(
        <div>
            <CRow>
                <CCol xs="12" sm="12" md="12" lg="12" xl="12">
                    <CCard>
                        <CCardHeader>
                            <CFormGroup>
                                <CLabel htmlFor="appendedInputButton">Search Product</CLabel>
                                <div className="controls">
                                    <CInputGroup>
                                        <CInputGroupPrepend>
                                            <CDropdown className="btn-group">
                                                <CDropdownToggle color="info">
                                                {searchBy}
                                                </CDropdownToggle>
                                                <CDropdownMenu>
                                                {
                                                    searchByOptions.map((e,i) => {
                                                        return(
                                                            <CDropdownItem key={i} onClick={() => setSearchBy(e)}>{e}</CDropdownItem>
                                                        )
                                                    })
                                                }
                                                </CDropdownMenu>
                                            </CDropdown>
                                        </CInputGroupPrepend>
                                        <CInput id="appendedInputButton" size="16" type="text" onChange={searchProduct}/>
                                    </CInputGroup>
                                </div>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={products}
                                fields={fields}
                                striped
                                itemsPerPage={limit}
                                pagination
                                scopedSlots = {{
                                    'brandId':
                                    (item) =>(
                                        <td>
                                            <CLink to={"/brands/"+item.brandId}>
                                                {item.brandId}
                                            </CLink>
                                        </td>
                                    ),
                                    'categoryNames':
                                    (item)=>(
                                        <td>
                                        {
                                            item.categoryIds.map((e, index) =>{
                                                return(
                                                    <CBadge key={index} color="secondary" style={{padding:8, marginRight:5, marginBottom:5}}>
                                                    {categorieListFind("id", e).name}
                                                    </CBadge>
                                                )
                                            })
                                        }
                                        </td>
                                    ),
                                    'vendorCount':
                                    (item)=>(
                                        <td>
                                            <CBadge color="danger" style={{padding:8, fontSize:16}}>
                                            {item.vendors.length}
                                            </CBadge>
                                        </td>
                                    ),
                                    'goDetail':
                                    (item)=>(
                                        <td>
                                            <CLink to={"/products/"+item.productId}>
                                                <CButton block shape="pill" color="primary" className="">Detail</CButton>
                                            </CLink>
                                        </td>
                                    )
                                }}
                            />
                            <CPagination
                                align="center"
                                activePage={pageNumber}
                                pages={totalPageCount}
                                onActivePageChange={setPageNumber}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
}

export default Products