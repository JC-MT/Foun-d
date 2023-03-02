import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const MyItems = ({
  user,
  isOpen,
  setIsOpen,
  authenticated,
  setDeleteItem,
  handleShow,
}) => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsersFoundItems(user);
  }, []); // eslint-disable-line

  const getUsersFoundItems = (foundUser) => {
    axios
      .get(`${API}/found/1`)
      .then((res) => {
        setUserItems(res.data);
      })
      .catch((error) => {
        setError(error);
      });
  };

	return (
		<div className="pt-20">
			{userItems[0] ? userItems.map((item) => {
				return item.itemname
			}) : 'No items'}
		</div>
	)
}
export default MyItems;
