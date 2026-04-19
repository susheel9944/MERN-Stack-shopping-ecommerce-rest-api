import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/productAPi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import { toast } from "react-toastify";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filter from "./layout/Filter";

const Home = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const ratings = searchParams.get("ratings");
  const category = searchParams.get("category") || "";

  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const params = { page, keyword };

  if (min !== null) params.min = Number(min);
  if (max !== null) params.max = Number(max);
  if (ratings) params.ratings = Number(ratings);

  if (category) params.category = category;

  console.log("category++", category);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={"By Best Product Online"} />
      <div className="container">
        <div className="row">
          {
            <div className="col-6 col-md-3 mt-5">
              <Filter />
            </div>
          }
          <div className={keyword ? "col-sm-6 col-md-9" : "col-sm-6 col-md-9"}>
            <h1 id="products_heading" className="text-secondary">
              {keyword
                ? `${data?.products?.length} Product found with keyword: ${keyword}`
                : "Latest Products"}
            </h1>

            <section id="products" className="mt-5">
              <div className="row">
                {data?.products?.map((item, index) => (
                  <ProductItem
                    key={item._id}
                    product={item}
                    columnSize={columnSize}
                  />
                ))}
              </div>
            </section>
            <CustomPagination
              resPerPage={data?.resPerPage}
              filteredProductCount={data?.filteredProductsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
