import jwt from "jsonwebtoken";

//Create JWT token
const TokenAndCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  //set cookies
  res.cookie("token", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
};

export default TokenAndCookie;
