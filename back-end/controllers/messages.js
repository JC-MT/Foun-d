const express = require("express");
const messages = express.Router();

const {
  getAllMessages,
  postNewMessage,
  updateMessageStatus
} = require("../queries/messages");

messages.get("/", async (req, res) => {

  const allMessages = await getAllMessages();

  if (allMessages) {
    res.status(200).json(allMessages);
  } else {
    res.status(404).send("Cannot find any Messages");
  }
});

messages.post("/", async (req, res) => {
  const newMessage = {
    receiver: req.body.receiver,
    sender: req.body.sender,
    itemName: req.body.itemname,
		content: req.body.content,
    isRead: req.body.isread,
  };

    const createdMessage = await postNewMessage(
			newMessage.receiver, 
			newMessage.sender, 
			newMessage.itemName, 
			newMessage.content, 
			newMessage.isRead
    );

    if (createdMessage) {
      res.status(201).json(createdMessage);
    } else {
      res.status(404).send("Message not created");
    }
  })

	messages.put("/:id", async (req, res) => {
		const { id } = req.params;
		console.log(req.params)
		console.log(req.body.isread)
	
		const updatedMessageData = {
			isRead: req.body.isread,
		};
	
			const updatedMessage = await updateMessageStatus(
				id,
				updatedMessageData.isRead
			);
			console.log(id, updatedMessageData)
	
		if (updatedMessage) {
			console.log("=== PUT message", updatedMessage, "===");
			res.status(200).json(updatedMessage);
		} else {
			res.status(404).send("Message not found");
		}
	});

	module.exports = messages;