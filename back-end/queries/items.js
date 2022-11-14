const db = require("../db/dbConfig.js");

const getAllItems = async () => {
  try {
    const items = await db.any("SELECT * FROM items");
    return items;
  } catch (err) {
    return err;
  }
};

const getItemsByID = async (id) => {
  try {
    const item = await db.any("SELECT * FROM items WHERE id = $1", id);
    return item;
  } catch (err) {
    return err;
  }
};

const createItems = async (    
    itemName,
    itemImg,
    category,
    description,
    found,
    lost,
    request,
    giveaway,
    pinLocation,
    neighborhood,
    borough,
    zipcode) => {
  try {
    const newItems = await db.one(
      "INSERT INTO items (itemName, itemImg, category, description, found, lost, request, giveaway, pinLocation, neighborhood, borough, zipcode) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
    [
       itemName,
       itemImg,
       category,
       description,
       found,
       lost,
       request,
       giveaway,
       pinLocation,
       neighborhood,
       borough,
       zipcode
    ]
    );
    return newItems;
  } catch (error) {
    return error;
  }
};

const updateItems = async (
    id,
    itemName,
    itemImg,
    category,
    description,
    found,
    lost,
    request,
    giveaway,
    pinLocation,
    neighborhood,
    borough,
    zipcode
) => {
  try {
    const updateItem = await db.one(
      "UPDATE items SET itemName = $1, itemImg = $2, category = $3, description = $4, found = $5, lost = $6, request = $7, giveaway = $8, pinLocation = $9, neighborhood = $10, borough = $11, zipcode = $12 where id=$13 RETURNING *",
      [
        itemName,
        itemImg,
        category,
        description,
        found,
        lost,
        request,
        giveaway,
        pinLocation,
        neighborhood,
        borough,
        zipcode,
        id
      ]
    );
    return updateItem;
  } catch (error) {
    return error;
  }
};

const deleteItems = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedItem = await db.one(
      "DELETE FROM items WHERE id=$1 RETURNING *",
      id
    );
    return deletedItem;
  } catch (error) {
    return error;
  }
};


module.exports = {
    getAllItems,
    getItemsByID,
    createItems,
    updateItems,
    deleteItems
};