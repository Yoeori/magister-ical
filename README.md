# Magister to iCal server
This is a small application I made with the help of the [magister.js](https://github.com/simplyGits/magisterJS) node package.

This application allows everyone to easily and securely add their [Magister](http://schoolmaster.nl/Voortgezet_Onderwijs.aspx) calendar to their personal calendar. A live version is available [here](https://school.yoeori.nl/services/calendar/).

## Running the application
Before you start make sure you have [Git](http://git-scm.com/) and [Node.js](https://nodejs.org/) 4.3 or greater installed and added to your `PATH`. To download and get the application running fill in the following commands:
```bash
$ git clone https://github.com/Yoeori/magister-ical.git
$ cd magister-ical
$ npm install
$ node server.js
```
You should now be able to connect via [http://localhost:3000](http://localhost:3000).

If your want to start the application in a subfolder make sure the variable `NODE_SUBURL` is set.

## Contributing
I'm trying to keep the application running for as long as I can but this will be my last year at high school and I won't be needing it anymore when I'm done so of course contributions are more then welcome in the form of a pull request! :smile:
