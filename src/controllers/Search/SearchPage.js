import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";

function SearchPage() {
  let { id } = useParams();
  let navigate = useNavigate();
  let [filterData, setFilterData] = useState({ collection: id });
  let [searchData, setSearchData] = useState([]);
  let [locList, setLocList] = useState([]);
  let getFilterData = async (filterData) => {
    let URL = "http://localhost:4008/api/filter";
    let { data } = await axios.post(URL, filterData);
    setSearchData([...data.newResult]);
  };
  let getLocationList = async (filterData) => {
    let URL = "http://localhost:4008/api/get-location";
    let { data } = await axios.get(URL);

    setLocList([...data.location]);
  };
  let makeFilter = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filterData };
    switch (type) {
      case "location":
        if (Number(value) > 0) {
          _filter["location"] = value;
        } else {
          delete _filter["location"];
        }
        break;
      case "sort":
        _filter["sort"] = value;
        break;

      case "cost-for-two":
        let _cost = value.split("-");
        _filter["lcost"] = _cost[0];
        _filter["hcost"] = _cost[1];
        break;
    }
    getFilterData(_filter);
    setFilterData({ ..._filter });
  };
  useEffect(() => {
    getFilterData(filterData);
    getLocationList();
  }, []);

  return (
    <>
      <Header color="bg-danger" />
      {/* <!-- section --> */}
      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3">Breakfast Places In Mumbai</p>
        </div>
        {/* <!-- food item --> */}
        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
            <div className="d-flex justify-content-between">
              <p className="fw-bold m-0">Filter</p>
              <button
                className="d-lg-none d-md-none btn"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilter"
                aria-controls="collapseFilter"
              >
                <span className="fa fa-eye"></span>
              </button>
            </div>
            {/* <!-- Collapse start  --> */}
            <div className="collapse show" id="collapseFilter">
              <div>
                <label htmlFor="" className="form-label">
                  Select Location
                </label>
                <select
                  className="form-select form-select-sm"
                  onChange={(event) => makeFilter(event, "location")}
                >
                  <option value="-1">All</option>

                  {locList.map((loc, index) => {
                    return (
                      <option value={loc.location_id} key={index}>
                        {loc.name}, {loc.city}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="mt-4 mb-2 fw-bold">Cuisine</p>
              <div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 fw-bold">Cost For Two</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="0-500"
                    name="cost-for-two"
                    onChange={(event) => makeFilter(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    less then 500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="500-1000"
                    name="cost-for-two"
                    onChange={(event) => makeFilter(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    500 to 1000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="1000-1500"
                    name="cost-for-two"
                    onChange={(event) => makeFilter(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1000 to 1500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="1500-2500"
                    name="cost-for-two"
                    onChange={(event) => makeFilter(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1500 to 2000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="2000-999999"
                    name="cost-for-two"
                    onChange={(event) => makeFilter(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    2000+
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 fw-bold">Sort</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="1"
                    onChange={(event) => makeFilter(event, "sort")}
                    name="sort"
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price low to high
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="-1"
                    name="sort"
                    onChange={(event) => makeFilter(event, "sort")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price high to low
                  </label>
                </div>
              </div>
            </div>
            {/* <!-- Collapse end --> */}
          </div>
          {/* <!-- search result --> */}
          <div className="col-12 col-lg-8 col-md-7">
            {searchData.map((restaurant, index) => {
              return (
                <div
                  className="col-12 food-shadow p-4 mb-4"
                  key={index}
                  onClick={() => navigate("/restaurant/" + restaurant._id)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={"/images/" + restaurant.image}
                      className="food-item"
                    />
                    <div className="ms-5">
                      <p className="h4 fw-bold">{restaurant.name}</p>
                      <span className="fw-bold text-muted">
                        {restaurant.city}
                      </span>
                      <p className="m-0 text-muted">
                        <i
                          className="fa fa-map-marker fa-2x text-danger"
                          aria-hidden="true"
                        ></i>
                        {restaurant.locality}, {restaurant.city}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div>
                      <p className="m-0">CUISINES:</p>
                      <p className="m-0">COST FOR TWO:</p>
                    </div>
                    <div className="ms-5">
                      <p className="m-0 fw-bold">
                        {restaurant.cuisine.reduce((pValue, cValue) => {
                          return pValue.name + ", " + cValue.name;
                        })}
                      </p>
                      <p className="m-0 fw-bold">
                        <i className="fa fa-inr" aria-hidden="true"></i>
                        {restaurant.min_price}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-12 pagination d-flex justify-content-center">
              <ul className="pages">
                <li>&lt;</li>
                <li className="active">1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>&gt;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
