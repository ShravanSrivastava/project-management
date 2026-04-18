import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({
    path:"./.env",
});

const port = process.env.port || 3000;


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app Listening at http://localhost${port}`);
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error", err)
    process.exit(1)
  })


let myusername = process.env.database;
console.log("value:",myusername)
console.log("Start of the awesome project");
