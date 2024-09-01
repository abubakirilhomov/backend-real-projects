const Shop = require("../models/Shop");

const getAllShop = async () => {
    return await Shop.find();
};

const getShopById = async (id) => {
    return await Shop.findById(id);
};

const createShop = async (type_shop, product_name, description, price, product_type) => {
    return await Shop.create({
        type_shop,
        product_name,
        description,
        price,
        product_type
    });
};


const deleteShop = async (id) =>  {
    return await Shop.deleteOne(id)
}

module.exports = { getAllShop, createShop, getShopById , deleteShop };
