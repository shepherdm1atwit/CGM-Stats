import React, { useState } from "react";
import LogoutButton from "./LogoutButton-BS";
import SettingsModal from "./SettingsModal-BS";
import { Navbar, Container } from "react-bootstrap";
import Logo from "../CGM_Logo.png";

const NavBar = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  function toggleBurgerMenu() {
    document.querySelector(".navbar-menu").classList.toggle("is-active");
  }

  return (
    <Navbar bg="success" className="position-sticky top-0">
      <Container>
        <Navbar.Brand href="#">
          <img src={Logo} width="200" height="125" />
        </Navbar.Brand>
        <SettingsModal />
      </Container>
    </Navbar>
  );
};

export default NavBar;
