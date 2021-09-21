const CategorieList = [
    {
        id: '0',
        name: 'Electronic',
        subCategories:[
            {
                id: '0_0',
                name: 'Computers',
                subCategories: []
            },
            {
                id: '0_1',
                name: 'Phones',
                subCategories:[
                    {
                        id: '0_1_0',
                        name: 'Android Phones',
                    },
                    {
                        id: '0_1_1',
                        name: 'iOS Phones',
                    }
                ]
            }
        ]
    }
];

const categorieListFind = (keyToFind, valToFind) =>{
    let foundObj;
    JSON.stringify(CategorieList, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

const getAllCategories = () => {
    let allCategories = [];
    JSON.stringify(CategorieList, (_, nestedValue) => {
        if (nestedValue && nestedValue["id"] != null) {
            allCategories.push(nestedValue);
        }
        return nestedValue;
    });
    return allCategories.map(e => {
        return {
            id: e.id,
            name: e.name
        }
    });
}

module.exports = {
    CategorieList,
    categorieListFind,
    getAllCategories
}