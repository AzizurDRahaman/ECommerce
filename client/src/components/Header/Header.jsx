/* eslint-disable no-unused-vars */
import logo from "../../assets/img/logo.png";
import { FaShoppingBag, FaOutdent, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const navLinks = [
  { path: "/", text: "Home" },
  { path: "/shop", text: "Shop" },
  { path: "/about", text: "About" },
  { path: "/contact", text: "Contact" },
  { path: "/sign-in", text: "Sign in" },
  { path: "/cart", text: "Cart" }, // Include cart page in navLinks
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/shop?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const { pathname } = location;
    const foundLink = navLinks.find((link) => link.path === pathname);
    setActiveLink(foundLink ? foundLink.text : "");
  }, [location]);

  const handleBarClick = () => {
    setIsActive(true);
  };

  const handleCloseClick = () => {
    setIsActive(false);
  };

  return (
    <section id={styles["header"]}>
      <Link to="/">
        <img src={logo} className={styles["logo"]} alt="logo" />
      </Link>

      <form className={styles["search"]} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles["search-button"]}>
          {" "}
          <FaSearch />{" "}
        </button>
      </form>

      <div>
        <ul id={styles["navbar"]} className={isActive ? styles["active"] : ""}>
          {navLinks.map((link) => (
            <li
              key={link.text}
              id={link.text === "Cart" ? styles["lg-bag"] : ""}
            >
              <Link
                to={
                  currentUser && link.text === "Sign in"
                    ? "/profile"
                    : link.path
                }
                className={`${
                  link.text === activeLink ? styles["active"] : ""
                } ${styles["link"]}`}
              >
                {link.text !== "Cart" && link.text !== "Sign in" ? (
                  link.text // Show link.text if it's not "Cart" or "Sign in"
                ) : link.text === "Cart" ? (
                  <span>
                  <FaShoppingBag /> {currentUser && `( ${currentUser.cart.length} )`} 
                  </span>
                ) : currentUser ? (
                  currentUser.name // Show currentUser.name if currentUser is available
                ) : (
                  "Sign in" // Show "Sign in" if currentUser is not available
                )}
              </Link>
            </li>
          ))}
          <a id={styles["close"]} onClick={handleCloseClick}>
            <FaXmark />
          </a>
        </ul>
      </div>

      <div id={styles["mobile"]}>
        <a href="cart.html">
          <FaShoppingBag className={styles.icon} />
        </a>
        <FaOutdent
          className={styles.icon}
          id={styles["bar"]}
          onClick={handleBarClick}
        />
      </div>
    </section>
  );
}
