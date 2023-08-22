import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import pathToSwaggerUi from "swagger-ui-dist";

import { connectDB } from "./src/database/db.js";
import { routerUser, routerMovie } from "./src/routes/index.js";
import { PORT } from "./src/utils/config.js";

const app = express();

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(pathToSwaggerUi.absolutePath()));

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
        url: "https://movie-app-be.vercel.app/",
        description: "Movie API Documentation",
      },
    ],
  },
  apis: ["src/**/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/users", routerUser);
app.use("/api/movie", routerMovie);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
