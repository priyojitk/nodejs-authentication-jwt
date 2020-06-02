/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import * as dbConfig from "./config/db.config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const port = process.env.PORT || 3000;
app.use("/api", userRouter);

// Home page
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
