const axios = require('axios');
const BASE_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=`;

exports.handler = async function (event, context) {
  try {
    const { latitude, longtitude } = event.queryStringParameters;
    const response = await axios.get(
      `${BASE_URL}${latitude},${longtitude}&key=${process.env.REACT_APP_API_KEY}`
    );
    const data = response.data.results[0].formatted_address;
    return {
      statusCode: 200,
      Accept: 'application.json',
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e.message);
  }
};
