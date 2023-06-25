import React, { useState } from "react";
import LogoutButton from "./LogoutButton-BS";
import SettingsModal from "./SettingsModal-BS";
import {Navbar, Container} from "react-bootstrap";

const NavBar = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  function toggleBurgerMenu() {
    document.querySelector('.navbar-menu').classList.toggle('is-active')
  }

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="\">CGM Stats</Navbar.Brand>
          <SettingsModal />
        <Navbar.Collapse className="justify-content-end">
          <LogoutButton />
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default NavBar;