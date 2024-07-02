export const handleOTP = (req, res) => {
    const { type, data } = req.body; //login: Req1
    if (type === "Req1") {
      return res.json("qwerty");
    } else {
      return res.status(404);
    }
  }