import React, { useState } from "react";
import LogoutButton from "./LogoutButton";
import SettingsModal from "./SettingsModal";

const Navbar = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isActive, setIsActive] = useState(false)


  const handleOpenSettingsModal = () => {
    if (!isSettingsModalOpen) {
      setIsSettingsModalOpen(true);
    }
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  function toggleBurgerMenu() {
    document.querySelector('.navbar-menu').classList.toggle('is-active')
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="\">
          CGM Stats
        </a>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navBar" onClick={toggleBurgerMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navBar" className='navbar-menu'>
        <div className="navbar-start">
          <a className="navbar-item" onClick={handleOpenSettingsModal}>
            Settings
          </a>

          {isSettingsModalOpen && (
            <SettingsModal onClose={handleCloseSettingsModal} />
          )}
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;