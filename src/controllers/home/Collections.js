import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Collections() {
  let navigate = useNavigate();
  let [collectionList, setCollectionList] = useState([]);
  let getCollectionList = async () => {
    try {
      let URL = "http://localhost:4008/api/get-collection-types";
      let { data } = await axios.get(URL);
      if (data.status === true) {
        setCollectionList([...data.collection_type]);
      } else {
        setCollectionList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCollectionList();
  }, []);
  return (
    <>
      <section className="row justify-content-center">
        <section className="col-10 mt-3">
          <h3 className="fw-bold text-navy">Collection Quick Searches</h3>
          <p className="text-secondary">Discover restaurants by collections</p>
        </section>
        <section className="col-10">
          <section className="row py-2">
            <section className="col-12 px-0 d-flex justify-content-between flex-wrap">
              {collectionList.map((collection, index) => {
                return (
                  <section
                    key={index}
                    className="px-0 d-flex border border-1 quick-search-item"
                    onClick={() =>
                      navigate("/search-page/" + collection.collection_id)
                    }
                  >
                    <img
                      src={"/images/" + collection.image}
                      alt=""
                      className="image-item"
                    />
                    <div className="pt-3 px-2">
                      <h4 className="text-navy">{collection.name}</h4>
                      <p className="small text-muted">{collection.content}</p>
                    </div>
                  </section>
                );
              })}
            </section>
          </section>
        </section>
      </section>
    </>
  );
}

export default Collections;
