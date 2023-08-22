import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import bodyParser from "body-parser";
import "dotenv/config";

import { connectDB } from "./src/database/db.js";
import { routerUser, routerMovie } from "./src/routes/index.js";
import { PORT } from "./src/utils/config.js";

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie API",
      version: "1.0.0",
      description: "API documentation for Movie operations",
    },
    servers: [
      {
        url: "http://localhost:3333/api/",
        description: "Movie API Documentation",
      },
    ],
  },
  apis: ["src/**/*.js"],
};

const specs = swaggerJsdoc(options);

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCssUrl: CSS_URL })
);

app.use("/api/users", routerUser);
app.use("/api/movie", routerMovie);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
