import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Product from "../../Components/Product/Product";
import Loading from "../../Components/Loading/Loading";
import ErrorPage from "../../Components/ErrorPage/ErrorPage";
import Categories from "../../Components/Categories/Categories";
import Slider from "../../Components/slider/Slider";
import { images } from "../../Components/slider/SliderImages";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
      // setProducts(result.data);
    };
    fetchData();
  }, []); // [] cause we use useEffect only once

  return (
    <div className="home__component">
      <div className="py-8">
        <Slider images={images} />
      </div>
      <div className="text-center pb-4 pt-8">
        <h2 className="text-gray-600 flex justify-center align-middle text-center md:inline-block border-b-2 w-4/12 font-Poppins border-solid border-lightgray text-4xl px-2 mx-auto">
          Products
        </h2>
      </div>

      <div className="text-center">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorPage />
        ) : (
          <>
            <Categories />
            <div className="products flex flex-wrap justify-center">
              {products.map((product) => (
                <div key={product.url}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
