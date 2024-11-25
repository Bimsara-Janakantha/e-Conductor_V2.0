import createHttpError from "http-errors";
import { db } from "../../db.js";

const calculateTimeDifference = (
  issuedDate,
  issuedTime,
  cancelDate,
  cancelTime
) => {
  console.log(
    `Issued on: ${issuedDate} ${issuedTime} | Canceled on: ${cancelDate} ${cancelTime}`
  );
  // Create full Date objects by combining the date and time strings
  const issuedDateTime = new Date(`${issuedDate}T${issuedTime}`);
  const cancelDateTime = new Date(`${cancelDate}T${cancelTime}`);

  // Calculate the difference in milliseconds
  const diffInMs = cancelDateTime - issuedDateTime;

  console.log("duration: " + diffInMs + "ms");

  // Convert milliseconds to days, hours, minutes, and seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);

  return { days, hours };
};

const calculateRefundAmount = (duration, ticketPrice) => {
  const refund = parseFloat(ticketPrice) * 0.75;

  console.log("Refund: LKR ", refund);
  return refund;
};

// Refund Request Handler
const Tkt5 = async (req, res, next) => {
  const { data } = req.body;
  console.log("Tkt5: Refund request data: ", data);

  try {
    // Query to get ticket details for the refund
    const sql1 = `SELECT issuedDate, issuedTime, ticketPrice FROM TICKET WHERE ticketNo = ?`;
    const [ticketResult] = await db.query(sql1, parseInt(data.refNo));

    console.log("Ticket Details: ", ticketResult);
    if (!ticketResult) {
      console.log("Ticket not found!");
      throw createHttpError(404, "Ticket not found");
    }

    const { issuedDate, issuedTime, ticketPrice } = ticketResult[0];

    // Calculating Time Gap in ms
    const duration = calculateTimeDifference(
      issuedDate,
      issuedTime,
      data.cancelDate,
      data.cancelTime
    );

    // Calculate refund amount
    const refundAmount = calculateRefundAmount(duration, ticketPrice);

    // Prepare response data
    const cancelData = {
      refNo: data.refNo,
      billingDate: issuedDate,
      billingTime: issuedTime,
      cancelDate: data.cancelDate,
      cancelTime: data.cancelTime,
      duration: `${duration.days} days ${duration.hours} hrs`,
      amount: ticketPrice,
      refund: refundAmount.toFixed(2),
    };

    // Send refund information back to client
    console.log("Refund Details: ", cancelData);
    res.status(200).json(cancelData);
  } catch (err) {
    console.error("Error processing refund:", err);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export default Tkt5;
