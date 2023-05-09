const Location = require("../models/location");

const createLocation = async (req, res) => {
  const locationName = req.body.locationName;
  const lon = req.body.lon;
  const lat = req.body.lat;
  const dollar_min = req.body.dollar_min;

  const location = new Location({
    locationName,
    lon,
    lat,
    dollar_min,
  });
  try {
    let response = await location.save();
    if (response) {
      return res.status(201).send({ message: "Location inserted Successful" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving location" });
  }
};

//get all orders
const getAllLocation = async (req, res) => {
  try {
    let locations = await Location.find();
    if (locations) {
      return res.json(locations);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving locations" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
module.exports = {
  createLocation,
  getAllLocation,
};
