const axios = require('axios');

const BASE_URL = 'https://api.data.gov.sg/v1/transport/carpark-availability';

exports.handler = async function (event, context) {
  try {
    const response = await axios.get(BASE_URL);
    const data = response.data.items[0].carpark_data;
    return {
      statusCode: 200,
      Accept: 'application.json',
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e.message);
  }
};
