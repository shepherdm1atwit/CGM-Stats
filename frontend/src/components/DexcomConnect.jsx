import React from "react";

const DexcomConnect = () => {

  const dexcomLogin = () => {
    const url = `https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=${encodeURIComponent("FzbQyNRMDTm8xdRrcR2STg8I7S781RC0")}&redirect_uri=${encodeURIComponent("http://localhost:8080/")}&response_type=code&scope=${encodeURIComponent("offline_access")}`;
    window.location.assign(url);
  };


  return (
    <form className="box" onSubmit={dexcomLogin}>
      <button type="submit" className="button is-primary">
        Connect with Dexcom
      </button>
    </form>
  );
};

export default DexcomConnect;