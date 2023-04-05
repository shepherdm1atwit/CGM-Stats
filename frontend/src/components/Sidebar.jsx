import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar-overlay${isOpen ? " is-active" : ""}`} onClick={toggleSidebar}></div>
      <div className={`sidebar${isOpen ? " is-active" : ""}`}>
        <aside className="menu">
          <ul className="menu-list">
            <li>
              <a href="#">Settings</a>
            </li>
            <li>
              <a href="#">Logout</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;