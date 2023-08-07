/**
 * @file LogoutButton.jsx
 * @brief Component for handling user logout.
 */

import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";   ///< User context for global state management.
import Button from "react-bootstrap/Button";   ///< Bootstrap React Button component.

/**
 * LogoutButton Component
 *
 * This component provides a button for users to logout.
 * On pressing the logout button, the user authentication token is cleared
 * and a session token is removed from the session storage.
 *
 * @returns {JSX.Element} The rendered LogoutButton component.
 */
const LogoutButton = () => {
  // Extract authentication token context
  const { authToken } = useContext(UserContext);
  const [, setToken] = authToken;

  /**
   * Handles the logout process.
   *
   * Clears the authentication token and removes the token
   * from session storage.
   */
  const handleLogout = () => {
    setToken("null");
    sessionStorage.setItem("CGMStatsToken", null);
  };

  // Rendering the logout button
  return (
    <Button variant="danger" className="button" onClick={handleLogout}>
      Logout of CGM Stats
    </Button>
  );
};

export default LogoutButton;
