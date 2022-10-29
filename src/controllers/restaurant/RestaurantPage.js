import { useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function RestaurantPage() {
  let [user, setUser] = useState(false);
  let [tab, setTab] = useState(true);
  let [menuItems, setMenuItems] = useState([]);
  let [finalPrice, setFinalPrice] = useState(0);
  let [paymentUserDetails, setPaymentUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  let { id } = useParams();
  let initValue = {
    aggregate_rating: 0,
    city: "",
    city_id: 0,
    collection_id: 0,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "/retaurent-background.png",
    locality: "",
    location_id: 0,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: "0",
  };
  let [restaurant, setRestaurant] = useState({ ...initValue });
  let readToken = async () => {
    // read from local storage
    try {
      let token = localStorage.getItem("token");
      token = await jwt_decode(token);
      setUser({ ...token });
    } catch (error) {
      localStorage.removeItem("token");
      setUser(false);
    }
  };
  let addQty = (id) => {
    let _menuItems = [...menuItems];
    _menuItems[id].qty += 1;

    let _finalPrice = finalPrice + Number(_menuItems[id].price);

    setFinalPrice(_finalPrice);
    setMenuItems([..._menuItems]);
  };
  let removeQty = (id) => {
    let _menuItems = [...menuItems];
    _menuItems[id].qty -= 1;

    let _finalPrice = finalPrice - Number(_menuItems[id].price);

    setFinalPrice(_finalPrice);
    setMenuItems([..._menuItems]);
  };
  let getRestaurantDetailsById = async (id) => {
    try {
      let { data } = await axios.get(
        "http://localhost:4008/api/get-restaurant-by-id/" + id
      );
      setRestaurant({ ...data.result });
    } catch (error) {
      alert("server side error");
    }
  };
  let getMenuList = async () => {
    try {
      let { data } = await axios.get(
        "http://localhost:4008/api/get-menu-item/" + id
      );
      setMenuItems([...data.result]);
    } catch (error) {
      setMenuItems([]);
      alert("server side error");
    }
    setFinalPrice(0);
  };

  let loadScript = async () => {
    const script = window.document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);

    // <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  };

  let loadPaymentGateway = async () => {
    if (
      paymentUserDetails.name === "" ||
      paymentUserDetails.email === "" ||
      paymentUserDetails.mobile === ""
    ) {
      alert("Please fill all details");
      return false;
    }

    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("Unable to load script");
      return false;
    }

    let { data } = await axios.post("http://localhost:4008/api/get-order-id", {
      amount: finalPrice,
    });
    if (data.status === false) {
      alert("Oops, unable to create order, try again");
      return false;
    }
    let { order } = data;

    var options = {
      key: "rzp_test_XD1PAxzXtFU5Ks", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "CIT Zomato Clone",
      description: "Food orders online",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Square_zomato_logo_new.png",
      order_id: order.id, // server side generated
      handler: async function (response) {
        let sendData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        let { data } = await axios.post(
          "http://localhost:4008/api/verify-payment",
          sendData
        );
        if (data.status === true) {
          alert("payment done successfully");
          window.location.assign("/");
        } else {
          alert("payment fail, try again.");
        }
      },
      prefill: {
        name: paymentUserDetails.name,
        email: paymentUserDetails.email,
        contact: paymentUserDetails.mobile,
      },
    };
    var paymentObject = window.Razorpay(options);
    paymentObject.open();
  };

  let updatePaymentUserDetails = (event) => {
    let { name, value } = event.target;

    let _paymentUserDetails = { ...paymentUserDetails };
    _paymentUserDetails[name] = value;

    setPaymentUserDetails({ ..._paymentUserDetails });
  };

  // mounting
  useEffect(() => {
    getRestaurantDetailsById(id);
    readToken();
  }, []);

  // updating
  useEffect(() => {
    if (user === false) {
      setPaymentUserDetails({
        name: "",
        email: "",
        mobile: "",
        address: "",
      });
    } else {
      setPaymentUserDetails({
        name: user.name,
        email: user.email,
        mobile: "",
        address: "",
      });
    }
  }, [user]);

  return (
    <>
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {restaurant.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {menuItems.map((menuItem, index) => {
                return (
                  <div key={index}>
                    <div className="row py-2">
                      <div className="col-8">
                        <p className="fw-bold fs-6 m-0">{menuItem.name}</p>
                        <p className="m-0">@{menuItem.price}</p>
                        <p className="m-0 text-muted">{menuItem.description}</p>
                      </div>
                      <div className="col-4 d-flex justify-content-end">
                        <div className="menu-food-item">
                          <img
                            src={"/images/" + menuItem.image}
                            alt=""
                            className="w-100 h-100"
                          />
                          {menuItem.qty === 0 ? (
                            <button
                              className="add btn btn-warning btn-sm"
                              onClick={() => addQty(index)}
                            >
                              Add
                            </button>
                          ) : (
                            <div className="order-item-count">
                              <span
                                className="hand"
                                onClick={() => removeQty(index)}
                              >
                                -
                              </span>
                              <span>{menuItem.qty}</span>
                              <span
                                className="hand"
                                onClick={() => addQty(index)}
                              >
                                +
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
            {finalPrice > 0 ? (
              <div className="d-flex justify-content-between px-3 pb-3">
                <h3>Total Amount : {finalPrice}</h3>
                <button
                  className="btn btn-primary"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  Process
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                User Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter User Name"
                  name="name"
                  value={paymentUserDetails.name}
                  onChange={updatePaymentUserDetails}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter Mobile Number"
                  name="mobile"
                  onChange={updatePaymentUserDetails}
                  value={paymentUserDetails.mobile}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={paymentUserDetails.email}
                  name="email"
                  onChange={updatePaymentUserDetails}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Enter Address"
                  name="address"
                  onChange={updatePaymentUserDetails}
                  value={paymentUserDetails.address}
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-between px-3 pb-3">
              <button
                className="btn btn-danger"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={loadPaymentGateway}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header color="bg-danger" />
      <div className="row justify-content-center">
        <div className="col-11 mt-2 position-relative">
          <div className="restaurant-image ">
            <img
              src={"/images/" + restaurant.image}
              alt=""
              className="w-100"
              style={{ height: "80vh" }}
            />
          </div>
          <button
            className="position-absolute bottom-0 end-0 mb-2 me-4 btn btn-outline-light"
            data-bs-toggle="modal"
            data-bs-target="#slideShow"
          >
            Image Gallery
          </button>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-11">
          <h1>{restaurant.name}</h1>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="list-unstyled d-flex gap-3 fw-bold">
              <li className="hand" onClick={() => setTab(true)}>
                Overview
              </li>
              <li className="hand" onClick={() => setTab(false)}>
                Contact
              </li>
            </ul>
            {user === false ? (
              <button className="btn btn-danger" disabled>
                Please Login To Place Order
              </button>
            ) : (
              <button
                className="btn btn-danger  "
                data-bs-toggle="modal"
                href="#exampleModalToggle"
                role="button"
                onClick={getMenuList}
              >
                Place Online Order
              </button>
            )}
          </div>
          {/* overview */}
          {tab ? (
            <div>
              <h3>About this place</h3>
              <p className="mb-0 fw-bold">Cuisine</p>
              <p>
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pValue, cValue) => {
                      return pValue.name + ", " + cValue.name;
                    })
                  : null}
              </p>
              <p className="mb-0 fw-bold">Average Cost</p>
              <p>₹{restaurant.min_price} for two people (approx.)</p>
            </div>
          ) : (
            <div>
              <h3>Contact</h3>
              <p className="mb-0 fw-bold">Phone Number</p>
              <p>{restaurant.contact_number}</p>
              <p className="mb-0 fw-bold">KFC</p>
              <p>
                {restaurant.locality},{restaurant.city}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default RestaurantPage;
