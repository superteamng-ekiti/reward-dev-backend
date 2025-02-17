import express, { Request, Response } from "express";
import { PORT } from "./utils/environment";
import cors from "cors";
import { solidLogger } from "./utils/globals";
import { MongoConnect } from "./database/mongo";
import { authRoute } from "./routes/auth.routes";
import { referralRoute } from "./routes/referrals.routes";
import usersRoute from "./routes/users.route";
import { badgeRoute } from "./routes/badges.routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*"
  })
);

// TODO - auth - calculate points - fetch points - fetch referrals
app.use("/api", authRoute);
app.use("/api", referralRoute);
app.use("/api", usersRoute);
app.use("/api", badgeRoute);

app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({
    status: 200,
    message: "Welcome to reward-dev's api endpoint",
    response: `You're hitting ${req.baseUrl} on reward-dev Backend... looks like you're connected. But then, why are you here 😒 ? If you are lost then refer to the APIs docs.`
  });
});

app.all("*", (req: Request, res: Response): Response => {
  const route = req.url;

  return res.status(404).json({
    message: "looks like you hit a wrong route",
    response: route + " does not exist",
    status: 404
  });
});

const start = async (): Promise<void> => {
  try {
    await MongoConnect();

    app.listen(PORT, () => {
      solidLogger("Server running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
