import express from "express";
import createHttpError from "http-errors";

const IncomeTotal = async (req, res, next) => {
  const { id } = req.body;

    console.log(`Requesting bus income for ID: ${id}`);


  try {
    // Type 1: Weekly data
    const receivedData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const refundData = [200, 139, 980, 390, 400, 380, 430];
    const earningData = receivedData.map((element, idx) => {
      return receivedData[idx] - refundData[idx];
    });
    const xLabels = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Type 2: Monthly data
    const monthlyReceivedData = [12000, 15000, 13000, 14000, 16000, 17000, 18000];
    const monthlyRefundData = [300, 200, 200, 220, 210, 200, 240];
    const monthlyEarningData = monthlyReceivedData.map((element, idx) => {
      return monthlyReceivedData[idx] - monthlyRefundData[idx];
    });
    const monthlyLabels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
    ];

    // Type 3: Annual data
    const annualReceivedData = [150000, 160000, 170000, 180000, 190000, 200000, 210000];
    const annualRefundData = [3000, 2500, 2700, 2200, 2100, 2300, 2400];
    const annualEarningData = annualReceivedData.map((element, idx) => {
      return annualReceivedData[idx] - annualRefundData[idx];
    });
    const annualLabels = [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ];

    res.json({
      weekly: { receivedData, refundData, earningData, xLabels },
      monthly: { receivedData: monthlyReceivedData, refundData: monthlyRefundData, earningData: monthlyEarningData, xLabels: monthlyLabels },
      annual: { receivedData: annualReceivedData, refundData: annualRefundData, earningData: annualEarningData, xLabels: annualLabels },
    });
  } catch (err) {
    console.log(err.message + "\n");
    next(createHttpError(503, "Failed to retrieve bus income data!"));
  }
};

export default IncomeTotal;
