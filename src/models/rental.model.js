import mongoose, { Schema } from "mongoose";

const rentalPropertySchema = new Schema({
  PROPERTYID: { type: String, required: true },
  RENTALAMOUNT: { type: Number, required: true },
  NOOFBEDROOMS: { type: Number, required: true },
  LOCATION: { type: String, required: true },
  CITY: { type: String, required: true },
});

export const RentalProperty = mongoose.model(
  "RENTAL_TBL",
  rentalPropertySchema
);
