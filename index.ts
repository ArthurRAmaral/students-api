import app from "./src/server";
import dotenv from "dotenv";
import "reflect-metadata";
import { setupConnection } from "./config";
dotenv.config();

const port = process.env.PORT;

app.listen(port, async () => {
  await setupConnection();
  console.log(`This beautiful and updated server is running on port ${port}`);
});
