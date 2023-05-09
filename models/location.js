const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocationSchema = new Schema({
  locationName: {
    type: String,
    required: true,
  },
  lon: {
    type: String,
    //required: true
  },
  lat: {
    type: String,
    //required: true
  },
  dollar_min: {
    type: String,
    required: true,
  },
});
const Location = mongoose.model("location", LocationSchema);

module.exports = Location;
