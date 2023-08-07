# CGM-Stats

## Overview

CGM Stats is a web application designed to provide users with a convinient interface for visualiznig data relating to
their blood glucose levels.

## Installation

### Prerequisites

Before deploying the CGM Stats application, there are some steps required, as detailed below:

1. You will need to provide information for an email host to send verification and password reset emails from.
   **Note:** An email delivery testing platform such as [Mailtrap](https://mailtrap.io/ "Mailtrap") can be used for
   testing if neccesary.
   You will need your email's:

- Host
- Port
- Username
- Password
- From address

2. Dexcom url, this will always be either https://sandbox-api.dexcom.com/ if testing the system
   or https://api.dexcom.com/ if deploying for production use.
3. Before using the URL above to make requests, a dexcom developer account and an application under that account will
   need to be created by following the instructions in
   the [Getting Started](https://developer.dexcom.com/docs/dexcom/getting-started/ "Getting Started") section
   of https://developer.dexcom.com/. Once registration is completed and an app has been created, the client ID and
   secret from the application will be needed.
4. Host domain or IP:port combination, the full domain name eg: `cgm.example.com` or ip/hostname:port combo
   eg: `10.1.10.50:8080` or `localhost:8080` that the system will be hosted/accessed on. This domain, including it's
   access protocol (`http://` or `https://`) will need to be added to the Dexcom application's authorized URI section,
   along with a version of URI including `/VerifyDexcom/`. For HTTPS, a version beginning with `http://` will also need
   to be added, as shown in the HTTPS example below:  
   ![dexcom redirect](https://user-images.githubusercontent.com/55757863/231327474-f3dfa34d-3fac-4c8d-8df5-7177c699e0b4.png)
5. A JWT private key/secret will be needed for generating tokens for authenticating users. This can either be a strong
   password, a long and random string, or generated using something like `ssh-keygen` (more detail on generating keys
   this way can be found [here](https://www.ssh.com/academy/ssh/keygen "ssh-keygen"))
6. Ensure that docker and docker-compose are installed.

### Deployment

1. Download this repository with `git clone https://github.com/shepherdm1atwit/CGM-Stats` or by downloading it as a .zip
   file and extracting to the desired location.
2. Fill in [app.config.EMPTY](backend/app/app.config.EMPTY) with the values prepared earlier, then simply remove
   the `.EMPTY` part of the file name, leaving only `app.config`.  
   **Note:** `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are for testing and debugging purposes, and will create a
   pre-verified test user to avoid needing to re-verify an email to test Dexcom connectivity. If either or both options
   are left blank, no test user is created.
3. Run `./deploy.sh` (or `./deploy-dev.sh` for a live development version with file watchers) from within the CGM-Stats
   folder to start the system. Once complete, the system will be running on port `8080`. From here, a reverse proxy can
   be used to expose the system to the internet or the system can be accessed via it's ip/port combination specified in
   the config file. If port `8080` is reserved or you would like to make the system directly available on port `80`, the
   frontend port can be changed by changint the frontend container's host port mapping
   in [docker-compose.yml](docker-compose.yml).

MIT License: [LICENSE](LICENSE)
