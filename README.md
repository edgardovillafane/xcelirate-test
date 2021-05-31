# EDGARDO VILLAFANE TEST

This project was created for assesstment purposes.


## How to intall

Please clone this project from Repo
[GIT HUB REPO](https://github.com/edgardovillafane/xcelirate-test)

Execute in terminal

### `npm install`


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\


### Main Features

- Renders a 5x5 grid and flip color after click or tap.
- Cells can be changed by “long pressing”. Indicating on gray which cells are being “selected” and will be affected.
- When the mouse button is released, all “selected” cells flip to the same color of the “source” cel
- Double-click a cell setting the whole column to the same color as the cell.
- Sending by POST to a mockup Server receiving a "status 200" response

### Some details

- Full compatibilty for desktop and touch screen mobile devices. Each event was render as mobile also.
- No libraries used for scripting. 
- CORS not allowed in postman-echo.com. Was provided another public mock server.


