import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

import "./ShowItem.scss";

const ShowItem = ({
  users,
  deleteItem,
  show,
  handleClose,
  handleClaim,
  user,
  authenticated,
}) => {
  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [item, setItem] = useState({});

  const [error, setError] = useState({});

  useEffect(() => {
    axios
      .get(`${API}/items/${itemId}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => setError(err));
  }, [API, itemId]);

  const handleItemDelete = async () => {
    await axios
      .delete(`${API}/found/${deleteItem.id}`)
      .then((res) => {
        axios
          .delete(`${API}/items/${deleteItem.id}`)
          .then((res) => {
            notify(res.data);
          })
          .catch((err) => {
            setError(err);
          });
      })
      .catch((err) => {
        setError(err);
      });
  };

  const notify = (deletedItem) => {
    toast.success(
      `You have successfully deleted ${deletedItem.itemname}. \n You will be redirected in 3 seconds.`,
      {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      }
    );
    setTimeout(() => {
      navigate("/index");
    }, 4100);
  };

  return (
    <div class="pt-20">
      {item.length > 0 ? (
        <>
          {users.map((foundUser) => {
            if (foundUser.id === item[0].userid) {
              // console.log(foundUser.id, user.id)
              return (
                <div className="p-2 flex flex-col" key={nanoid()}>
                  <img className="place-self-center w-[200px] h-[200px]" src={item[0].itemimg} alt="item" />
                  <div>
                    <h1>Found by: {foundUser.username}</h1>
                    <h2>
                      Status: {item[0].status ? item[0].status : `Unknown`}
                    </h2>
                    <h2>Title: {item[0].itemname}</h2>
                    <h3>Description: {item[0].description}</h3>
                    <h3>Neighborhood: {item[0].neighborhood}</h3>{" "}
                    <h3>Borough: {item[0].borough}</h3>{" "}
                    <h3>Zipcode: {item[0].zipcode}</h3>{" "}
                    {item[0] && foundUser.id !== user.id && authenticated ? (
                      <Button
                        onClick={() => {
                          handleClaim(item[0].userid, item[0].itemname);
                        }}
                        id="claim-button"
                        variant="success"
                      >
                        Claim 👉 {item[0].itemname}
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      ) : (
        <h1>No Iteam with this ID has been found</h1>
      )}
      {deleteItem.id ? (
        <>
          <Modal show={show} onHide={handleClose}>
            <Image id="deleteItemImg" src={deleteItem.itemimg} alt="item" />
            <Modal.Header id="modalHeader">
              <Modal.Title>Deleting: {deleteItem.itemname}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modalBody">
              Are you sure you want to delete this item?{" "}
              <p>THIS ACTION IS IRREVERSIBLE!</p>
            </Modal.Body>
            <Modal.Footer id="modalFooter">
              <Button variant="success" onClick={handleClose}>
                CANCEL
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleItemDelete();
                }}
              >
                CONFIRM
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : null}
      {/* {error ? <p>{error}</p> : null} */}
      <ToastContainer autoClose={3000} theme="dark" />
    </div>
  );
};

export default ShowItem;
