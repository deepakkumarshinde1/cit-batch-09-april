import Header from "../Header";

function Wallpaper() {
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
            <select className="form-select mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3">
              <option value="">select location</option>
            </select>
            <div className="w-75 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search for restaurants"
              />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Wallpaper;
