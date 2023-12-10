/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from "./Shop.module.css";
import Pagination from "../../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Card from '../../Card/Card'

export const Shop = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    clotheType: "clotheTypeAll",
    type: "allType",
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const clotheTypeFromUrl = urlParams.get("clotheType");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      clotheTypeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        clotheType: clotheTypeFromUrl || "clotheTypeAll",
        type: typeFromUrl || "allType",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchProducts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/product/get?${searchQuery}`);
      const data = await res.json();
      const { products, productsCount, currentPageProductsCount } = data;
      setTotalCount(productsCount);
      setProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "allType" ||
      e.target.id === "T-Shirt" ||
      e.target.id === "Pants" ||
      e.target.id === "Shirt"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (
      e.target.id === "clotheTypeAll" ||
      e.target.id === "Work" ||
      e.target.id === "Fashion" ||
      e.target.id === "Casual"
    ) {
      setSidebardata({ ...sidebardata, clotheType: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("clotheType", sidebardata.clotheType);
    urlParams.set("type", sidebardata.type);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/shop?${searchQuery}`);
  };

  return (
    <>
      <section id="page-header" className={styles["shop-header"]}>
        <h2>#fashionkaboss</h2>
        <p>Save more with coupons & up to 70% off!</p>
      </section>
      <section id={styles["product1"]} className="section-p1">
        <div id={styles["formholder"]}>
          <form onSubmit={handleSubmit}>
            <div className={styles["inputdiv"]}>
              <label>Search Term:</label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                onChange={handleChange}
                value={sidebardata.searchTerm}
              />
            </div>
            <div className={styles["checkbox-div"]}>
              <label>Style:</label>
              <div>
                <input
                  type="checkbox"
                  id="clotheTypeAll"
                  onChange={handleChange}
                  checked={sidebardata.clotheType === "clotheTypeAll"}
                />
                <span>All</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Work"
                  onChange={handleChange}
                  checked={sidebardata.clotheType === "Work"}
                />
                <span>Work</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Fashion"
                  onChange={handleChange}
                  checked={sidebardata.clotheType === "Fashion"}
                />
                <span>Fashion</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Casual"
                  onChange={handleChange}
                  checked={sidebardata.clotheType === "Casual"}
                />
                <span>Casual</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className={styles["checkbox-div"]}>
              <label>Type:</label>
              <div>
                <input
                  type="checkbox"
                  id="allType"
                  onChange={handleChange}
                  checked={sidebardata.type === "allType"}
                />
                <span>All</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="T-Shirt"
                  onChange={handleChange}
                  checked={sidebardata.type === "T-Shirt"}
                />
                <span>T-Shirt</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Shirt"
                  onChange={handleChange}
                  checked={sidebardata.type === "Shirt"}
                />
                <span>Shirt</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="Pants"
                  onChange={handleChange}
                  checked={sidebardata.type === "Pants"}
                />
                <span>Pants</span>
              </div>
            </div>
            <div className={styles["inputdiv"]}>
              <label>Sort:</label>
              <select
                id="sort_order"
                className="border rounded-lg p-3"
                onChange={handleChange}
                defaultValue={"created_at_desc"}
              >
                <option value='regularPrice_desc' >Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value="createdAt_desc" >Latest</option>
              <option value="createdAt_asc" >Oldest</option>
              </select>
            </div>
            <button className={styles["buttonclass"]}>Search</button>
          </form>
        </div>

        <div className={styles["pro-container"]}>
        {!loading && products.length === 0 && 
            <p className="text-xl text-slate-700" >No Listings Found</p>
          }
          {loading && 
            <p className="text-xl text-slate-700 text-center w-full " >Loading...</p>
          }
          {!loading && products &&
            products.map((product) => {
              return <Card key={product._id} props={product} />
            })
          }
        </div>
      </section>
      <Pagination totalItems={totalCount} itemsPerPage={12}/>
    </>
  );
};
