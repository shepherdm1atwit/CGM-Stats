


const DexcomConnect= () => {


const dexcomLogin = async () => {
    window.location.href="https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=http://localhost:8080/&response_type=code&scope=offline_access";

    };


  return (
    <form className="box" onSubmit={dexcomLogin}>
      <button className="button is-primary : button">
          Connect with Dexcom
      </button>
    </form>
  );
};

export default DexcomConnect;
