const ApiServerUrl = "http://localhost:4000";

// Auth

const LoginApiService = (username, password) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username: username, password: password})
        };
        fetch(`${ApiServerUrl}/auth/login`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        })
    });
}

const LoginControlApiService = () => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(`${ApiServerUrl}/auth/loginControl`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

// Products

const searchProducts = (searchInput, searchType) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchInput, searchType})
        };
        fetch(`${ApiServerUrl}/api/searchProduct`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetProducts = (limit, offset) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit, offset})
        };
        fetch(`${ApiServerUrl}/api/getProducts`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetProduct = (productId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId})
        };
        fetch(`${ApiServerUrl}/api/getProduct`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetProductImages = (productId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId})
        };
        fetch(`${ApiServerUrl}/api/getProductImages`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateProductInfos = (productId, productData) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, productData})
        };
        fetch(`${ApiServerUrl}/api/updateProductInfos`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const uploadProductImage = (productId, image) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, image })
        };
        fetch(`${ApiServerUrl}/api/uploadProductImage`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const addProduct = (productData, productImages) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productData, productImages })
        };
        fetch(`${ApiServerUrl}/api/addProduct`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const deleteImage = (imageName) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageName })
        };
        fetch(`${ApiServerUrl}/api/deleteImage`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}


// Brands

const searchBrands = (searchInput, searchType, limit) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchInput, searchType, limit})
        };
        fetch(`${ApiServerUrl}/api/searchBrand`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetBrands = (limit, offset) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit, offset})
        };
        fetch(`${ApiServerUrl}/api/getBrands`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetBrand = (brandId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId: brandId})
        };
        fetch(`${ApiServerUrl}/api/getBrand`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetBrandLogo = (brandId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId: brandId})
        };
        fetch(`${ApiServerUrl}/api/getBrandLogo`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateBrandInfos = (brandId, brandData) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId, brandData})
        };
        fetch(`${ApiServerUrl}/api/updateBrandInfos`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateBrandLogo = (brandId, image) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId, image })
        };
        fetch(`${ApiServerUrl}/api/updateBrandLogo`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const addBrand = (brandData, brandLogo) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandData, brandLogo })
        };
        fetch(`${ApiServerUrl}/api/addBrand`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}


// Vendors

const searchVendors = (searchInput, searchType, limit) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchInput, searchType, limit})
        };
        fetch(`${ApiServerUrl}/api/searchVendor`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetVendors = (limit, offset) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit, offset})
        };
        fetch(`${ApiServerUrl}/api/getVendors`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetVendor = (vendorId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vendorId: vendorId})
        };
        fetch(`${ApiServerUrl}/api/getVendor`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateVendorInfos = (vendorId, vendorData) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vendorId, vendorData})
        };
        fetch(`${ApiServerUrl}/api/updateVendorInfos`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const addVendor = (vendorData) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vendorData })
        };
        fetch(`${ApiServerUrl}/api/addVendor`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}


// Card

const searchCards = (searchInput, searchType, limit) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchInput, searchType, limit})
        };
        fetch(`${ApiServerUrl}/api/searchCard`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetCards = () => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(`${ApiServerUrl}/api/getCards`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetCard = (cardId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId })
        };
        fetch(`${ApiServerUrl}/api/getCard`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const GetCardImage = (cardId) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId })
        };
        fetch(`${ApiServerUrl}/api/getCardImage`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateCardInfos = (cardId, cardData) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId, cardData })
        };
        fetch(`${ApiServerUrl}/api/updateCardInfos`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const updateCardImage = (cardId, image) => {
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId, image })
        };
        fetch(`${ApiServerUrl}/api/updateCardImage`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}

const addCard = (cardData, cardImage) =>{
    return new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardData, cardImage })
        };
        fetch(`${ApiServerUrl}/api/addCard`, requestOptions)
        .then(response =>response.json())
        .then(data => {
            resolve(data);
        });
    });
}


module.exports = {
    LoginApiService,
    LoginControlApiService,
    searchProducts,
    GetProducts,
    GetProduct,
    GetProductImages,
    updateProductInfos,
    deleteImage,
    uploadProductImage,
    addProduct,
    searchBrands,
    GetBrands,
    GetBrand,
    GetBrandLogo,
    updateBrandInfos,
    updateBrandLogo,
    addBrand,
    searchVendors,
    GetVendors,
    GetVendor,
    updateVendorInfos,
    addVendor,
    searchCards,
    GetCards,
    GetCard,
    GetCardImage,
    updateCardInfos,
    updateCardImage,
    addCard
}