import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/db/app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error:", error);
      throw error;
    });

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running at port:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MOGO DB CONNECTION FAILED !!!", err);
  });
