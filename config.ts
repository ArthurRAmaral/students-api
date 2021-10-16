import { Student } from "./src/entities/Student";
import { createConnection } from "typeorm";
import { Environment } from "./src/shared/enums/environment";

export const setupConnection = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Student],
    synchronize: process.env.NODE_ENV === Environment.DEVELOPMENT,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

  console.log("Connected to database");
};
