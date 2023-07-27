import React, { useState } from "react";
import LogoutButton from "./LogoutButton-BS";
import SettingsModal from "./SettingsModal-BS";
import { Nav, Container, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div id="sidebar" className={`offcanvas offcanvas-start${show ? " show" : ""}`}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close text-reset" onClick={handleClose}></button>
        </div>
        <div className="offcanvas-body">
          <Nav className="flex-column">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link onClick={() => setIsSettingsModalOpen(true)}>Settings</Nav.Link>
            <LogoutButton />
          </Nav>
          <SettingsModal
            isOpen={isSettingsModalOpen}
            closeModal={() => setIsSettingsModalOpen(false)}
          />
        </div>
      </div>

      <div className="d-flex flex-column">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <Container>
            <button className="navbar-toggler" type="button" onClick={handleShow}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <a className="navbar-brand" href="/">
              CGM Stats
            </a>
          </Container>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
