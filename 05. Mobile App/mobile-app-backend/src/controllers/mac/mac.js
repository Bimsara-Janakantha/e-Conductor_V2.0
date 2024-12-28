// Import mac module
import createHttpError from "http-errors";
import macaddress from "macaddress";

export const getMac = (req, res, next) => {
  console.log("\n\nGetting MAC Address");

  macaddress.one((err, mac) => {
    if (err) {
      console.error("Error fetching MAC address:");
      next(createHttpError(503, "Unable to retrieve MAC address"));
    } else {
      console.log(`MAC Address: ${mac}`);
      res.status(200).json(mac);
    }
  });
};
