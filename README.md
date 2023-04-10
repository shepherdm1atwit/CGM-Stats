# CGM-Stats
## Overview
CGM Stats is a web application designed to provide users with a convinient interface for visualiznig data relating to their blood glucose levels.
## Setup
### Prerequisites
Deployment of this application is simple, but requires a few pieces of information before you begin:
1. Email host information including:  
  i. Host  
  ii. Port  
  iii. Username  
  iv. Password  
  v. From address  
**Note:** An email delivery testing platform such as [Mailtrap](https://mailtrap.io/ "Mailtrap") can be used for testing if neccesary.
2. Host domain or IP:port combination, the full domain name eg: `cgm.example.com` or ip/port combo eg: `10.1.10.50:8080` that the system will be hosted/accessed on.
3. Dexcom url, this will always be either https://sandbox-api.dexcom.com/ if testing the system or https://api.dexcom.com/ if deploying for production use.
4. Before using the URL above to make requests, a dexcom developer account will need to be created by following the instructions in the [Getting Started](https://developer.dexcom.com/docs/dexcom/getting-started/ "Getting Started") section of https://developer.dexcom.com/. Once registration is completed and an app has been created, the client ID and secret will be needed.
5. A JWT private key/secret will be needed for generating tokens for authenticating users. This can either be a strong password, a long and random string, or generated using something like `ssh-keygen` (more detail on generating keys this way can be found [here](https://www.ssh.com/academy/ssh/keygen "ssh-keygen"))
#### Optional
If incremental development or other testing is required, an auto-verified test account can optionally be set up when docker-compose is run. Leave blank for no test account.
6. 
7. 
### Deployment
# TODO HERE
