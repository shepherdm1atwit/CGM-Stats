/**
 * @file NavBar.jsx
 * @brief Navigation bar component for the application.
 */

import React, { useState } from "react";
import SettingsModal from "./SettingsModal-BS";   ///< Settings modal component.
import { Navbar, Container } from "react-bootstrap";   ///< Bootstrap React components for styling.
import Logo from "../CGM_Logo.png";   ///< Logo for the navigation bar.

/**
 * NavBar Component
 *
 * This component provides a navigation bar for the application. It includes
 * the application logo and provides an access point to the settings modal.
 *
 * @returns {JSX.Element} The rendered NavBar component.
 */
const NavBar = () => {
  // State for managing the Settings modal's open/close status
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  /**
   * Toggles the burger menu on and off (for mobile view).
   */
  function toggleBurgerMenu() {
    document.querySelector(".navbar-menu").classList.toggle("is-active");
  }

  // Rendering the navigation bar with logo and settings modal
  return (
    <Navbar bg="success" className="position-sticky top-0">
      <Container>
        <Navbar.Brand href="#">
          <img src={Logo} width="200" height="125" alt="CGM Logo"/>
        </Navbar.Brand>
        <SettingsModal />
      </Container>
    </Navbar>
  );
};

export default NavBar;
