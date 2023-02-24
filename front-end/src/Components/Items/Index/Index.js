import { useState, useEffect } from "react";
import axios from "axios";

import RenderIndex from "./RenderIndex/RenderIndex";
import windowDimensions from "../../../Hooks/GetWindowDimensions";
import IndexSkeloton from "./IndexSkeleton/IndexSkeloton";
import FilteredSearch from "./FilteredSearch/FilteredSearch";
import RenderMapIndex from "./RenderMapIndex/RenderMapIndex";

const IndexContainer = ({ user, users, authenticated, setUsers }) => {
  const { width, height } = windowDimensions();
  const API = process.env.REACT_APP_API_URL;

  const [foundItems, setFoundItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [filteredSearchOptions, setFilteredSearchOptions] = useState({
    category: "",
    borough: "",
    neighborhood: "",
    date1: "",
    date2: "",
  });
  const [filterSearches, setFilterSearches] = useState(false);
  const [switchView, setSwitchView] = useState(false);
  const [active, setActive] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    getItems();
    // make index auto navigate to homepage if user is not authenticated \\

    // const localAuthenticated = window.localStorage.getItem("Authenticated");
    // const authenticatedInterval = setInterval(() => {
    //   if (!localAuthenticated) {
    //     navigate("/");
    //   }
    // }, 3000);

    // return () => clearInterval(authenticatedInterval);
  }, []); // eslint-disable-line

  const getItems = async () => {
    if (itemName !== "") {
      return;
    }
    await axios
      .get(`${API}/items`)
      .then((res) => {
        setFoundItems(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div >
			    <RenderMapIndex
            foundItems={foundItems}
            user={user}
            authenticated={authenticated}
          />
      {/* <aside id="searhSection-aside">
        <FilteredSearch
          itemName={itemName}
          setItemName={setItemName}
          setFilteredSearchOptions={setFilteredSearchOptions}
          setFilterSearches={setFilterSearches}
        />
      </aside>
      <div id="switchViewContainer">
        <div id="switchViewButtons">
          <Button
            id="listButton"
            className={!active ? "active" : ""}
            variant="outline-dark"
            onClick={() => {
              setSwitchView(false);
              setActive(false);
            }}
          >
            List
          </Button>
          <Button
            id="mapButton"
            variant="outline-dark"
            className={active ? "active" : ""}
            onClick={() => {
              setSwitchView(true);
              setActive(true);
            }}
          >
            Map
          </Button>
        </div>
      </div>
      <br />
      <section id="indexInnerSection">
        {error && <p>{error}</p>}
        {switchView ? (
          <RenderMapIndex
            foundItems={foundItems}
            user={user}
            authenticated={authenticated}
          />
        ) : foundItems.length > 0 ? (
          foundItems.map((itemFound) => {
            return (
              <RenderIndex
                key={nanoid()}
                itemFound={itemFound}
                user={user}
                users={users}
                authenticated={authenticated}
                width={width}
                height={height}
                itemName={itemName}
                filteredSearchOptions={filteredSearchOptions}
                filterSearches={filterSearches}
                setUsers={setUsers}
              />
            );
          })
        ) : (
          <IndexSkeloton />
        )}
      </section> */}
    </div>
  );
};

export default IndexContainer;
