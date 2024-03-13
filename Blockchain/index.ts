// Use the api keys by specifying your api key and api secret
require("dotenv").config();
const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

// Pinata SDK SET-UP

const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

async function testAuthentication() {
  try {
    const res = await pinata.testAuthentication();
    console.log(res);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

testAuthentication();
// "message": "Congratulations! You are communicating with the Pinata API"!"
