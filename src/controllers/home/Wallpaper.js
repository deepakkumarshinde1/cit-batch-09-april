import Header from "../Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Wallpaper() {
  let navigate = useNavigate();
  let [locList, setLocList] = useState([]);
  let [restList, setRestList] = useState([]);
  let [searchData, setSearchData] = useState({
    location: "",
    restName: "",
  });
  let getLocationList = async (filterData) => {
    let URL = "https://cit-batch-09-april-api.herokuapp.com/api/get-location";
    let { data } = await axios.get(URL);

    setLocList([...data.location]);
  };
  let getLocationValue = (event) => {
    var _loc_id = event.target.value;
    setSearchData({ ...searchData, location: _loc_id });
  };

  let getRestaurantList = async (event) => {
    if (searchData.location === "") {
      alert("Select Location First");
      setSearchData({ ...searchData, restName: "" });
      return false;
    }
    var _restName = event.target.value;
    setSearchData({ ...searchData, restName: _restName });
    if (_restName === "") {
      setRestList([]);
      return false;
    }
    let URL = `https://cit-batch-09-april-api.herokuapp.com/api/get-restaurant-by-location-id?lid=${searchData.location}&rest=${_restName}`;
    let { data } = await axios.get(URL);
    setRestList([...data.result]);
  };
  useEffect(() => {
    getLocationList();
  }, []);
  return (
    <>
      <section className="row main-section align-content-start">
        <div className="col-12 d-flex justify-content-center">
          <Header color="" />
        </div>

        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0">Z</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3">
            <select
              onChange={getLocationValue}
              className="form-select mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
              value={searchData.location}
            >
              <option value="">select location</option>
              {locList.map((loc, index) => {
                return (
                  <option value={loc.location_id} key={index}>
                    {loc.name}, {loc.city}
                  </option>
                );
              })}
            </select>
            <div className="w-75 d-flex flex-column position-relative">
              <div className="w-100 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-search text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control py-2 px-3"
                  placeholder="Search for restaurants"
                  onChange={getRestaurantList}
                  value={searchData.restName}
                />
              </div>
              <ul className="list-group position-absolute w-100 top-100">
                {restList.map((restaurant, index) => {
                  return (
                    <li
                      key={index}
                      className="list-group-item"
                      onClick={() => navigate("/restaurant/" + restaurant._id)}
                    >
                      <b>{restaurant.name}</b>, {restaurant.city}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Wallpaper;
