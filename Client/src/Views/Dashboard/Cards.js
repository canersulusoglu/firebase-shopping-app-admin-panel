import React, { useEffect, useState} from 'react'
import { 
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CDataTable,
    CButton,
    CLink
} from '@coreui/react';
import { 
    GetCards
} from '../../api_service'


const Cards = () => {
    const [cards, setCards] : [] = useState([]);
    const fields = [
        'cardId',
        'name',
        'goDetail'
    ];

    useEffect(() => {
        GetCards().then(data => {
            if(data.isSuccess){
                var actualData = data.data.map(e => {
                    return {
                        cardId: e.id,
                        name: e.data.name,
                    }
                });
                setCards(actualData);
            }
        });
    }, []);

    return(
        <div>
            <CRow>
                <CCol xs="12" sm="12" md="12" lg="12" xl="12">
                    <CCard>
                        <CCardHeader>
                            Cards
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={cards}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots = {{
                                    'goDetail':
                                    (item)=>(
                                        <td>
                                            <CLink to={"/cards/"+item.cardId}>
                                                <CButton block shape="pill" color="primary" className="">Detail</CButton>
                                            </CLink>
                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
}

export default Cards