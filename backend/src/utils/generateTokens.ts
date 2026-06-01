import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  const signedJWT = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return signedJWT;
};

export default generateToken;
