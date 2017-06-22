# Magister to iCal server [deprecated]
This is a small application I made with the help of the [magister.js](https://github.com/simplyGits/magisterJS) node package.

This application allows everyone to easily and securely add their [Magister](http://schoolmaster.nl/Voortgezet_Onderwijs.aspx) calendar to their personal calendar. A live version is available [here](https://school.yoeori.nl/services/calendar/).

## Deprecated
As I am not in highschool anymore I can't maintain the project anymore. Please feel free to clone it and try to get it working again.

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
Of course contributions are more then welcome in the form of a pull request! :smile:
