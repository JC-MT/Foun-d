const db = require("../db/dbConfig.js");

const getAllMessages = async () => {
  try {
    const allMessage = await db.any(`SELECT * FROM messages`);
    return allMessage;
  } catch (err) {
    return err;
  }
};

const postNewMessage = async ( receiver, sender, itemName, content, isRead) => {
  try {
    const newMessage = await db.one(
      "INSERT INTO messages ( receiver, sender, itemName, content, isRead) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [ receiver, sender, itemName, content, isRead]
    );
    return newMessage;
  } catch (err) {
    return err;
  }
};

const updateMessageStatus = async (id, isRead) => {
  try {
    const updateFound = await db.one(
      "UPDATE messages SET isRead = $1 WHERE id = $2 RETURNING *",
      [isRead, id]
    );
    return updateFound;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllMessages,
  postNewMessage,
  updateMessageStatus
};