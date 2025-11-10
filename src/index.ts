import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./lib/swagger";
import { errorHandler } from "./middleware/errorHandler";
import ServiceRouter from "./router/service";
import UserRouter from "./router/user";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

app.use(cors());

app.get("/api/test", (_, res) => {
  res.send({
    success: true,
    data: "OK",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/user", UserRouter);
app.use("/api/service", ServiceRouter);

app.use(errorHandler);

// Start the server only if this file is run directly (not imported)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
