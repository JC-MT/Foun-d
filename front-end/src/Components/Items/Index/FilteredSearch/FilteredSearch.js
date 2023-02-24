import { useState } from "react";
import { Form, Button, Dropdown, Card, Image } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";

import "./FilteredSearch.scss";

const FilteredSearch = ({
  itemName,
  setItemName,
  setFilteredSearchOptions,
  setFilterSearches,
}) => {
  const [neighborhood, setNeighborhood] = useState("");
  const [selectCategory, setSelectCategory] = useState("Default");
  const [selectBorough, setSelectBorough] = useState("Default");

  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  const [calendarValue1, setCalendarValue1] = useState("");
  const [calendarValue2, setCalendarValue2] = useState("");

  const [calendarDate1, setCalendarDate1] = useState(new Date());
  const [calendarDate2, setCalendarDate2] = useState(new Date());

  const selectedDate1 = moment(calendarDate1).format("MMMM Do, YYYY");
  const selectedDate2 = moment(calendarDate2).format("MMMM Do, YYYY");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "itemName") {
      setItemName(value);
    } else if (name === "neighborhood") {
      setNeighborhood(value);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectCategory(e.target.value);
  };

  const handleBoroughChange = (e) => {
    setSelectBorough(e.target.value);
  };

  const handleDateChange1 = (date) => {
    setCalendarDate1(date);
    setCalendarValue1(selectedDate1);
  };

  const handleDateChange2 = (date) => {
    setCalendarDate2(date);
    setCalendarValue2(selectedDate2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      selectCategory !== "Default" ||
      selectBorough !== "Default" ||
      calendarValue1 !== "" ||
      calendarValue2 !== "" ||
      neighborhood !== ""
    ) {
      setFilterSearches(true);
      setFilteredSearchOptions({
        category: selectCategory,
        borough: selectBorough,
        neighborhood: neighborhood,
        date1: calendarDate1,
        date2: calendarDate2,
      });
    } else {
      setFilterSearches(false);
    }
  };

  const clearDatesFunction = () => {
    setCalendarValue1("");
    setCalendarValue2("");
  };

  return (
    <Form id="searhSection-form" onSubmit={handleSubmit}>
      <section id="searhSection-innerSection">
        <Form.Group controlId="formBasicSearchbar">
          <Form.Control
            type="text"
            name="itemName"
            placeholder="Item Name"
            onChange={handleChange}
            value={itemName}
          />
        </Form.Group>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="advancedSearchButton">
            Advanced Search
          </Dropdown.Toggle>

          <Dropdown.Menu id="filterListContainer" variant="dark">
            <section id="filterList">
              <Card id="filterCategory">
                <h2>Category</h2>
                <br></br>
                <Form.Select
                  aria-label="filter-Category"
                  id="filter-category"
                  value={selectCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="Default">--- Pick A Category ---</option>
                  <option value="Pets">Pets</option>
                  <option value="Toys">Toys</option>
                  <option value="Health">Health</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Personal">Personal</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Botany">Botany (Plants)</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Card>

              <Card id="filterLocation">
                <h2>Location</h2>
                <span>Borough: </span>
                <Form.Select
                  aria-label="filter-Category"
                  id="filter-category"
                  value={selectBorough}
                  onChange={handleBoroughChange}
                >
                  <option value="Default">--- Pick A borough ---</option>
                  <option value="Bronx">Bronx</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Manhattan">Manhattan</option>
                  <option value="Queens">Queens</option>
                  <option value="Staten Island">Staten Island</option>
                </Form.Select>

                <Form.Group controlId="formBasicNeighborhood">
                  <Form.Label>Neighborhood</Form.Label>
                  <Form.Control
                    type="text"
                    name="neighborhood"
                    placeholder="Neighborhood"
                    onChange={handleChange}
                    value={neighborhood}
                  />
                </Form.Group>
              </Card>

              <Card id="filterDateRange">
                <h2>Date Range</h2>
                <br></br>
                <div id="innerDateRange">
                  <Form.Group controlId="formBasicDate1">
                    <Form.Label>Date 1</Form.Label>
                    <div id="calendar1Container">
                      <Form.Control
                        type="text"
                        name="date1"
                        value={calendarValue1}
                        disabled
                      />
                    </div>
                    {calendarOpen1 ? (
                      <Calendar
                        className="calendarOne"
                        onChange={handleDateChange1}
                        value={calendarDate1}
                      />
                    ) : null}
                  </Form.Group>

                  <Form.Group controlId="formBasicDate1">
                    <Form.Label>Date 2</Form.Label>
                    <div id="calendar2Container">
                      <Form.Control
                        type="text"
                        name="date2"
                        value={calendarValue2}
                        disabled
                      />
                    </div>
                    {calendarOpen2 ? (
                      <Calendar
                        className="calendarTwo"
                        onChange={handleDateChange2}
                        value={calendarDate2}
                      />
                    ) : null}
                  </Form.Group>
                  <br></br>
                  <Button
                    variant="dark"
                    onClick={() => {
                      clearDatesFunction();
                    }}
                  >
                    Clear Dates
                  </Button>
                </div>
              </Card>
            </section>
            <Button variant="success" id="filteredSearchButton" type="submit">
              Filter Search
            </Button>
          </Dropdown.Menu>
        </Dropdown>
      </section>
    </Form>
  );
};

export default FilteredSearch;
