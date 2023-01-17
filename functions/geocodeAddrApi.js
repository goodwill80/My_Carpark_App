const axios = require('axios');
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

exports.handler = async function (event, context) {
  try {
    const { query } = event.queryStringParameters;
    const response = await axios.get(
      `${BASE_URL}${query}+singapore&key=${process.env.REACT_APP_API_KEY}`
    );
    const data = response.data.results[0]?.geometry?.location;
    return {
      statusCode: 200,
      Accept: 'application.json',
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e.message);
  }
};
