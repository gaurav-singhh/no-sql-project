import { RentalProperty } from "../models/rental.model.js";

const generatePropertyID = (city) => {
  return `${city.slice(0, 3).toUpperCase()}${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

const createRentalProperty = async (bean) => {
  const newProperty = new RentalProperty(bean);
  await newProperty.save();
  return 1; // Assuming 1 record is inserted
};

const findPropertyByCriteria = async (
  minRentalAmount,
  maxRentalAmount,
  bean
) => {
  const properties = await RentalProperty.find({
    RENTALAMOUNT: { $gte: minRentalAmount, $lte: maxRentalAmount },
    NOOFBEDROOMS: bean.noOfBedrooms,
    LOCATION: { $regex: new RegExp(bean.location, "i") },
    CITY: { $regex: new RegExp(bean.city, "i") },
  });
  return properties;
};

const validateCity = (city) => {
  const validCities = ["Chennai", "Bengaluru"];
  if (
    !validCities.includes(
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    )
  ) {
    throw new InvalidCityException();
  }
};

class InvalidCityException extends Error {
  toString() {
    return "INVALID CITY";
  }
}

const addproperty = async (req, res) => {
  try {
    const { RENTALAMOUNT, NOOFBEDROOMS, LOCATION, CITY } = req.body;

    if (!RENTALAMOUNT || !NOOFBEDROOMS || !LOCATION || !CITY) {
      return res.status(400).json({ error: "NULL VALUES IN INPUT" });
    }
    if (
      RENTALAMOUNT <= 0 ||
      NOOFBEDROOMS <= 0 ||
      LOCATION.length === 0 ||
      CITY.length === 0
    ) {
      return res.status(400).json({ error: "INVALID INPUT" });
    }

    try {
      validateCity(CITY);
    } catch (error) {
      return res.status(400).json({ error: "INVALID CITY" });
    }

    const propertyId = generatePropertyID(CITY);
    const bean = {
      PROPERTYID: propertyId,
      RENTALAMOUNT,
      NOOFBEDROOMS,
      LOCATION,
      CITY,
    };

    const recordsInserted = await createRentalProperty(bean);
    if (recordsInserted > 0) {
      res.status(201).json({
        message: `SUCCESS with Your Regno: 22BCE7822 - ${propertyId}`,
        property: bean,
      });
    } else {
      res.status(500).json({ error: "FAILURE" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add property", error: err.message });
  }
};

const fetchRentalProperty = async (req, res) => {
  const { minRentalAmount, maxRentalAmount, noOfBedrooms, location, city } =
    req.query;

  if (
    minRentalAmount === 0 ||
    maxRentalAmount === 0 ||
    maxRentalAmount < minRentalAmount ||
    noOfBedrooms <= 0 ||
    !location ||
    !city ||
    location.length === 0 ||
    city.length === 0
  ) {
    return res.status(400).json({ error: "INVALID VALUES" });
  }

  try {
    validateCity(city);
  } catch (error) {
    return res.status(400).json({ error: "INVALID CITY" });
  }

  const properties = await findPropertyByCriteria(
    minRentalAmount,
    maxRentalAmount,
    {
      noOfBedrooms,
      location,
      city,
    }
  );
  if (properties.length === 0) {
    return res.status(404).json({ message: "NO MATCHING RECORDS" });
  }

  return res
    .status(200)
    .json({ message: `RECORDS AVAILABLE: ${properties.length}`, properties });
};

export {
  addproperty,
  createRentalProperty,
  generatePropertyID,
  validateCity,
  fetchRentalProperty,
};
