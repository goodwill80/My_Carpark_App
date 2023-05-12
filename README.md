# Carpark Availability App

## Live Link
https://sensational-zabaione-393a34.netlify.app/

## Starting the App from IDE

1. npm install
2. npm run netlify dev

## Description
![My Image](Carpark_app.png)
The Carpark Availability App :
1. Allows users to search for available lots in HDB-run carparks near their current location or a location of their choosing by using APIs to harness data from a variety of sources.
2. Navigate to carpark destination using Google Direction.
3. Saving the carpark location to localstorage as favorite for easy retrieval and use in future.
4. Communicate with passager via Whatsapp API on driver's pickup location along with navigation for passenger to reach a driver's location. 
5. Sending SOS help signal if driver encounters emergency, use cases include (i.e. medical, dangerous situation, vehicle breakdown in isolated areas and more)

Try out our project [here](https://sensational-zabaione-393a34.netlify.app 'link to deployed site')!

## Important to note before using the app:

- No login is required
- The User Agreement is meant to seek user's consensus of releasing his/her current coordinates
- You'll need to enable location settings on your browser for the app to work

## Features

- User location tracking
- Carpark lot availability tracking (refreshed hourly)
- Table of results
  - Search parameters (location, distance, free parking, night parking)
  - Filtering of results (by distance, lots available, total lots)
  - Ability to edit results (deletion of carparks with no lots availabile)
  - Pagination
  - Route planning for drivers (via driving)
- Login functionality
  - Automatically generated message for passenger route planning (via walking)
  - Emergency contact nomination
  - One-click SOS
- Mobile responsiveness

## Resources Used

- Google Directions API
- Google Geocoding API
- Google Maps Javascript API
- [@react-google-maps/api](https://github.com/JustFly1984/react-google-maps-api/tree/master/packages/react-google-maps-api 'react google maps api')
- [Geolib](https://github.com/manuelbieh/geolib#readme 'geolib')
- [React Whatsapp](https://github.com/andrelmlins/react-whatsapp 'react whatsapp')

## Team

- [Jonathan](https://github.com/goodwill80 "jonathan's github")
- [Ace](https://github.com/acetay "ace's github")
- [Yingwang](https://github.com/shiywsg "yingwang's github")
- [Claire](https://github.com/clairetkw "claire's github")
