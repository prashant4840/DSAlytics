import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  const signedJWT = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
  return signedJWT;
};

export default generateToken;
