import React, { useEffect, useState} from 'react'
import { 
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CDataTable,
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
    GetBrands,
    searchBrands
} from '../../api_service'

const searchByOptions = [
    'name'
]


const Brands = () => {
    const [searchBy, setSearchBy] = useState(searchByOptions[0]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [brands, setBrands] : [] = useState([]);

    const limit = 10;
    const fields = [
        'brandId',
        'name',
        'website',
        'goDetail'
    ];

    useEffect(() => {
        var offset = (pageNumber - 1) * limit;
        GetBrands(limit, offset).then(data => {
            if(data.isSuccess){
                var actualData = data.data.map(e => {
                    return {
                        brandId: e.id,
                        name: e.data.name,
                        website: e.data.website,
                    }
                });
                var totalBrandCount = data.totalBrandCount;
                var pageCount = Math.ceil((totalBrandCount / limit));
                setTotalPageCount(pageCount);
                setBrands(actualData);
            }
        });
    }, [pageNumber])

    const searchBrand = (e) =>{
        var value = e.target.value;
        if(value.length >= 3){
            searchBrands(value, searchBy).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e => {
                        return {
                            brandId: e._ref._path.segments.lastItem,
                            name: e._fieldsProto.name.stringValue,
                            website: e._fieldsProto.website.stringValue,
                        }
                    });
                    setBrands(actualData);
                }else{
                    setBrands([]);
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
                                <CLabel htmlFor="appendedInputButton">Search Brands</CLabel>
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
                                        <CInput id="appendedInputButton" size="16" type="text" onChange={searchBrand}/>
                                    </CInputGroup>
                                </div>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={brands}
                                fields={fields}
                                striped
                                itemsPerPage={limit}
                                pagination
                                scopedSlots = {{
                                    'website':
                                    (item) =>(
                                        <td>
                                            <a href={item.website} rel="noreferrer" target="_blank">
                                                {item.website}
                                            </a>
                                        </td>
                                    ),
                                    'goDetail':
                                    (item)=>(
                                        <td>
                                            <CLink to={"/brands/"+item.brandId}>
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

export default Brands