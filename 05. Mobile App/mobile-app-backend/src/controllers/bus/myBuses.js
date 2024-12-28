import createHttpError from "http-errors";

const MyBuses = async (req, res, next) => {
  const { id } = req.body;

  console.log(`Requesting buses belongs to ID: ${id}`);

  const Busses = [
    {
      id: "22",
      regNo: "NA-1316",
      service: "Normal",
      seats: 54,
      rides: 7442,
      ridesIncrement: -2.7,
      earning: 97922.41,
      earningIncrement: 11.7,
      rating: 0.1,
      insuranceExp: "2026-10-22",
      VRL_Exp: "2026-10-22",
    },
    {
      id: "23",
      regNo: "NB-3020",
      service: "Semi-Luxury",
      seats: 54,
      rides: 3378,
      ridesIncrement: 73.0,
      earning: 53132.19,
      earningIncrement: 48.4,
      rating: 2.8,
      insuranceExp: "2026-10-22",
      VRL_Exp: "2026-10-22",
    },
    {
      id: "24",
      regNo: "NC-5485",
      service: "Luxury",
      seats: 54,
      rides: 3524,
      ridesIncrement: 2.3,
      earning: 91355.3,
      earningIncrement: -85.8,
      rating: 5.0,
      insuranceExp: "2026-10-22",
      VRL_Exp: "2026-10-22",
    }
  ];

  try {
    res.json(Busses);
  } catch (err) {
    console.log(err.message + "\n");
    next(createHttpError(503, "Failed to retrieve bus data!"));
  }
};

export default MyBuses;
