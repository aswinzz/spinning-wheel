# Spinner Wheel


Spin a wheel with different prices to randomly select an item

## Functionalities

- The data of the spinner wheel comes from an API and it is displayed as sections
- Clicking on spin will run the spinner wheel at a default speed
- Alternatively, the user can click on the power tab where depending on the selected power the spinner wheel will spin and selects a random item
- Pull to refresh functionality is present to refresh the page without reloading.
- The container width is fixed to mobile size, so in all window dimension the spinner wheel and other components will be of fixed size.
- The randomly obtained item will be recorded in a google sheet with timestamp and the selected item index.
- Loading and error states have been handled

### How to run locally
- clone this repo
- create an ```.env``` file and add the corresponding google sheets API keys (check .env.example file for reference)
- run ```npm i```
- run ```npm run start```
- application will open at port 3000

### API for getting data
- ```Endpoint``` : https://60852621d14a87001757772d.mockapi.io/api/v1/get-spinner-data
- ```Method``` : ```GET```
- ```Response```: ```["Better luck!","2X Savings","₹100 Cashback","₹20 💸","₹50 💸","1.5X Savings","2X Savings","₹50 💸"]```

### Google Sheets
For this functionality to work there are 3 environment variables that needs to be added
- ```REACT_APP_GAPI_EMAIL``` this key should contain the google service account email address
- ```REACT_APP_SPREADSHEET_ID``` this key should contain the google sheets id which is present in the url of the sheet
- ```REACT_APP_GAPI_KEY``` this is the google api private key that can be obtained from google console

Follow these steps to obtain the service account email and private key:
- Go to the [Google Developers Console](https://console.developers.google.com/)
- Select your project or create a new one (and then select it)
- Enable the Sheets API for your project
- In the sidebar on the left, select APIs & Services > Credentials
- Click "+ CREATE CREDENITALS" and select "Service account" option
- Enter name, description, click "CREATE"
- You can skip permissions, click "CONTINUE"
- Click "+ CREATE KEY" button
- Select the "JSON" key type option
- Click "Create" button
- your JSON key file is generated and downloaded to your machine (it is the only copy!)
- click "DONE"
- both email and private key will be present in the downloaded JSON file

Application is live at [https://aswinvb.com/spinning-wheel](https://aswinvb.com/spinning-wheel)