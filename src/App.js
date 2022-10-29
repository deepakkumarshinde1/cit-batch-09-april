import HomePage from "./controllers/home/HomePage";
import SearchPage from "./controllers/Search/SearchPage";
import { Routes, Route } from "react-router-dom";
import RestaurantPage from "./controllers/restaurant/RestaurantPage";

function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-page/:id" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
