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
    GetVendors,
    searchVendors
} from '../../api_service'

const searchByOptions = [
    'name'
]


const Vendors = () => {
    const [searchBy, setSearchBy] = useState(searchByOptions[0]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [vendors, setVendors] : [] = useState([]);

    const limit = 10;
    const fields = [
        'vendorId',
        'name',
        'email',
        'city',
        'contact',
        'goDetail'
    ];

    useEffect(() => {
        var offset = (pageNumber - 1) * limit;
        GetVendors(limit, offset).then(data => {
            if(data.isSuccess){
                var actualData = data.data.map(e => {
                    return {
                        vendorId: e.id,
                        name: e.data.name,
                        email: e.data.email,
                        city: e.data.city,
                        contact: e.data.contact,
                    }
                });
                var totalVendorCount = data.totalVendorCount;
                var pageCount = Math.ceil((totalVendorCount / limit));
                setTotalPageCount(pageCount);
                setVendors(actualData);
            }
        });
    }, [pageNumber])

    const searchVendor = (e) =>{
        var value = e.target.value;
        if(value.length >= 3){
            searchVendors(value, searchBy).then(data => {
                if(data.isSuccess){
                    var actualData = data.data.map(e => {
                        return {
                            vendorId: e._ref._path.segments.lastItem,
                            name: e._fieldsProto.name.stringValue,
                            email: e._fieldsProto.email.stringValue,
                            city: e._fieldsProto.city.stringValue,
                            contact: e._fieldsProto.contact.stringValue,
                        }
                    });
                    setVendors(actualData);
                }else{
                    setVendors([]);
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
                                <CLabel htmlFor="appendedInputButton">Search Vendors</CLabel>
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
                                        <CInput id="appendedInputButton" size="16" type="text" onChange={searchVendor}/>
                                    </CInputGroup>
                                </div>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={vendors}
                                fields={fields}
                                striped
                                itemsPerPage={limit}
                                pagination
                                scopedSlots = {{
                                    'goDetail':
                                    (item)=>(
                                        <td>
                                            <CLink to={"/vendors/"+item.vendorId}>
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

export default Vendors