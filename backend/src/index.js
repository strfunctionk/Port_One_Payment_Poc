import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import apiRoute from "./routes/index.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { stateHandler } from "./middlewares/state.middleware.js";
import { swaggerOptions } from "./configs/swagger.config.js";
import { corsOptions } from "./configs/cors.config.js";
import { swaggerHandler } from "./middlewares/swagger.middleware.js";

dotenv.config();

const REQUIRED_ENV = [
  "DATABASE_URL",
  "JWT_SECRET",
  "ACCESS_TOKEN_EXPIRATION",
  "REFRESH_TOKEN_EXPIRATION",
  "PORTONE_STORE_ID",
  "PORTONE_API_SECRET",
  "CLERK_SECRET_KEY",
];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `[Startup Error] Missing required environment variables: ${missingEnv.join(", ")}`,
  );
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(stateHandler);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(null, swaggerOptions),
);

app.get("/openapi.json", swaggerHandler);

app.use("/api/v1/", apiRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});
