import {
  FaFire,
  FaStar,
  FaHamburger,
  FaTags,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

import "../styles/Menu.css";

const bestSellers = [
  {
    id: 1,
    name: "Chicken Burger",
    price: "₹199",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    name: "Cheese Pizza",
    price: "₹349",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
];

const comboOffers = [
  {
    id: 1,
    name: "Burger Combo",
    price: "₹299",
    oldPrice: "₹399",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    id: 2,
    name: "Pizza Combo",
    price: "₹499",
    oldPrice: "₹649",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
];

const budgetMeals = [
  {
    id: 1,
    name: "Mini Meals",
    price: "₹99",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
  {
    id: 2,
    name: "Student Combo",
    price: "₹149",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  },
];

export default function MenuPage() {
  return (
    <div className="menu-page">

      
      <div className="top-bar">
        <h1>Menu Management</h1>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search dishes..." />
        </div>
      </div>

      
      <section>
        <div className="section-title">
          <FaFire className="title-icon" />
          <h2>Best Sellers</h2>
        </div>

        <div className="card-container">
          {bestSellers.map((item) => (
            <div className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="badge bestseller">
                <FaStar />
                Bestseller
              </div>

              <div className="card-content">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section>
        <div className="section-title">
          <FaHamburger className="title-icon" />
          <h2>Combo Offers</h2>
        </div>

        <div className="card-container">
          {comboOffers.map((item) => (
            <div className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="badge combo">
                <FaTags />
                25% OFF
              </div>

              <div className="card-content">
                <h3>{item.name}</h3>

                <div className="price-row">
                  <span className="new-price">{item.price}</span>
                  <span className="old-price">{item.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUDGET FRIENDLY */}
      <section>
        <div className="section-title">
          <FaMoneyBillWave className="title-icon" />
          <h2>Budget Friendly</h2>
        </div>

        <div className="card-container">
          {budgetMeals.map((item) => (
            <div className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="badge budget">
                Under ₹150
              </div>

              <div className="card-content">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}