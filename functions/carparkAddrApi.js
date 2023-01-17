const axios = require('axios');

const BASE_URL =
  'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000&q=';

exports.handler = async function (event, context) {
  try {
    const response = await axios.get(BASE_URL);
    const data = response.data.result.records;
    return {
      statusCode: 200,
      Accept: 'application.json',
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e.message);
  }
};
