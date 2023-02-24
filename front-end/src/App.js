// Library Imports
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// Component Imports
import NavBar from "./Components/NavBar/NavBar";
import SideBar from "./Components/NavBar/Sidebar/SideBar";
import MyItems from "./Components/Accounts/Profile/MyItems/MyItems";
import Chatbox from "./Components/Chatbox/Chatbox";
import ViewUserSettings from "./Components/Accounts/EditAccount/ViewUserSettings";
import Edit from "./Components/Accounts/EditAccount/Edit";
import NewItemForm from "./Components/Items/Create/NewItemForm";
import ShowItem from "./Components/Items/Show/ShowItem";

// Page Imports
import Homepage from "./Pages/Home/Home";
import Indexpage from "./Pages/Items/Index/Index";
import Createpage from "./Pages/Items/Create/New";
import Editpage from "./Pages/Items/Edit/Edit";
import GiveawayPage from "./Pages/Items/Giveaway/Giveaway";

// Hook imports
import useMessages from "./Hooks/useMessages";
import useHamburgerMenu from "./Hooks/useHamburgerMenu";

// Styling Imports
import FourOFour from "./Components/404/FourOFour";

export default function App() {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  // const [model, setModel, modelStructure] = useModel({ handleDelete });

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [deleteItem, setDeleteItem] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [claimItem, setClaimItem] = useState({ user: {}, item: "" });
  const [show, setShow] = useState(false);
  const [messages, setMessages, reFetch] = useMessages();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      setUser(JSON.parse(data));
      setAuthenticated(JSON.parse(authenticated));
    } else {
      setUser({});
      setAuthenticated(false);
    }

    getUsers();

    const UsersInterval = setInterval(() => {
      getUsers();
    }, 5000);

    return () => clearInterval(UsersInterval);
  }, []); // eslint-disable-line

  const getUsers = async () => {
    await axios.get(`${API}/users`).then((res) => {
      setUsers(res.data);
    });
  };

  const handleUser = async (user) => {
    setUser(user);
    setAuthenticated(true);
    window.localStorage.setItem("Current_User", JSON.stringify(user));
    window.localStorage.setItem("Authenticated", JSON.stringify(true));
    navigate(`/`);
  };

  const handleLogout = () => {
    setUser({});
    setAuthenticated(false);
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null && data !== undefined) {
      window.localStorage.setItem("Current_User", JSON.stringify({}));
      window.localStorage.setItem("Authenticated", JSON.stringify(false));
    }
    navigate(`/`);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  function handleClaim(userId, itemName) {
    let getUser = users.find((user) => user.id === userId);
    setClaimItem({ user: getUser, item: itemName });
  }

	const loggedInUser = [{ id: ''}]
	const notification = []
	const  [ active, setActive, hamburgerMenuStructure ] = useHamburgerMenu({notification, loggedInUser})

      /* {model ? modelStructure : ""} */
      /* <MyItemsSidebar
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={isOpen}
        onClose={handleOnClose}
        customBurgerIcon={false}
        right
      >
        <MyItems
          user={user}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          authenticated={authenticated}
          setDeleteItem={setDeleteItem}
          handleShow={handleShow}
          // handleItemDelete={handleItemDelete}
          // setModel={setModel}
        />
      </MyItemsSidebar> */
   return   (
	 		<div>
				{hamburgerMenuStructure}
				<nav>
        <NavBar
          user={user}
          users={users}
          handleUser={handleUser}
          authenticated={authenticated}
          handleLogout={handleLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
					setActive={setActive}
          active={active}
        />
				</nav>
        {/* <Chatbox
          claimItem={claimItem}
          setClaimItem={setClaimItem}
          // model={model}
          user={user}
          users={users}
          authenticated={authenticated}
          messages={messages}
          setMessages={setMessages}
        /> */}
        <main className={`${ active ? 'brightness-90' : ''}`}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/index"
              element={
                <Indexpage
                  user={user}
                  users={users}
                  authenticated={authenticated}
                  setUsers={setUsers}
                />
              }
            />
            <Route
              path="/giveaway"
              element={
                <GiveawayPage
                  user={user}
                  users={users}
                  authenticated={authenticated}
                />
              }
            />
            <Route path="/new" element={<Createpage user={user} />} />
            <Route path="/newitem" element={<NewItemForm user={user} />} />
            <Route
              path="/show/:itemId"
              element={
                <ShowItem
                  users={users}
                  user={user}
                  deleteItem={deleteItem}
                  show={show}
                  handleClaim={handleClaim}
                  handleClose={handleClose}
									authenticated={authenticated}
                />
              }
            />
            <Route path="/edit/:itemId" element={<Editpage user={user.id} />} />
            <Route path="/:userId/settings" element={<NavBar user={user} />} />
            <Route
              path="/:userId/viewsettings"
              element={<ViewUserSettings user={user} />}
            />
            <Route path="/:userId/edit" element={<Edit user={user} />} />
            <Route path="/404" element={<FourOFour />} />
            <Route path="/*" element={<FourOFour />} />
          </Routes>
        </main>
      </div>
		);
};
