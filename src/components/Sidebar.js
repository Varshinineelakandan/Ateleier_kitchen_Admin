import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../components/logo.png";
import admin from "../components/logo.png";

import {
  FaHome,
  FaUtensils,
  FaTable,
  FaClipboardList,
  FaConciergeBell,
  FaUsers,
  FaChartBar,
  FaBoxes
} from "react-icons/fa";

export default function Sidebar() {
 

  return (
    <>

      <div className="sidebar">

        
        <div className="logo-section">
          <img src={logo} alt="logo" className="logo-img" />

         
            <div className="logo-text">
              <h1>
                ATELIER <span>KITCHEN</span>
              </h1>
              <p>Restaurant Admin</p>
            </div>
        
        </div>

       
        <nav className="menu">

          <NavLink to="/" className="menu-item">
            <FaHome />
            DashBoard
          </NavLink>

          <NavLink to="/orders" className="menu-item">
            <FaClipboardList />
            Orders
          </NavLink>

          <NavLink to="/tables" className="menu-item">
            <FaTable />
            Tables
          </NavLink>

          <NavLink to="/menu" className="menu-item">
            <FaUtensils />
            Menu
          </NavLink>

          <NavLink to="/reservations" className="menu-item">
            <FaConciergeBell />
           Reservations
          </NavLink>

          <NavLink to="/staff" className="menu-item">
            <FaUsers />
            Staffs
          </NavLink>

          <NavLink to="/reports" className="menu-item">
            <FaChartBar />
            Reports
          </NavLink>

          <NavLink to="/inventory" className="menu-item">
            <FaBoxes />
            Inventory
          </NavLink>

        </nav>

        
        <div className="admin-profile">
          <img src={admin} alt="admin" />

          
            <div>
              <h3>Admin</h3>
              <p>Restaurant Manager</p>
            </div>
        
        </div>

      </div>
    </>
  );
}