import { Request, Response } from "express";
import axios from "axios";
import User from "../models/userModel"; // Assuming you have a User model

const pfpAggrigate = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.usernames) {
      return res.status(403).json({ error: "Usernames not found" });
    }

    const usernames = user.usernames; // Assuming usernames are stored in the user document

    const urls: { [key: string]: string } = {};

    if (usernames?.gfg) {
      urls.gfg = `${process.env.VITE_GFG}${usernames.gfg}`;
    }
    // if (usernames?.leetcode) {
    //   urls.leetcode = `${process.env.VITE_LEETCODE}${usernames.leetcode}`;
    // }
    // if (usernames?.codechef) {
    //   urls.codechef = `${process.env.VITE_CODECHEF}${usernames.codechef}`;
    // }
    if (usernames?.codeforces) {
      urls.codeforces = `${process.env.VITE_CODEFORCES}${usernames.codeforces}`;
    }
    // if (usernames?.interviewbit) {
    //   urls.interviewbit = `${process.env.VITE_INTERVIEWBIT}${usernames.interviewbit}`;
    // }
    console.log(urls);
    const requests = Object.entries(urls).map(([key, url]) =>
      axios.get(url).then((response) => ({ key, data: response.data }))
    );

    const responses = await Promise.all(requests);

    const result = responses.reduce((acc, response) => {
      acc[response.key] = response.data;
      return acc;
    }, {} as { [key: string]: any });

    // const result = await axios.get(
    //   "https://codeforces.com/api/user.info?handles=nischalshetty02"
    // );
    // console.log(result);

    res.json(result.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data from one or more platforms" + error,
    });
  }
};

export default pfpAggrigate;
