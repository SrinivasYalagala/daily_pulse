import express from "express";
import { notFoundResponse } from "./src/Utils/Response.js";
import handleError from "./src/Utils/HandelError.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    tagsSorter: "alpha",
    docExpansion: "none",
  },
}),
);

import authenticationRouter from "./src/Routers/AuthenticationRouter.js";
import userRouter from "./src/Routers/UserRouter.js";
import actionRouter from "./src/Routers/ActionRouters.js";
import blockerRouter from "./src/Routers/BlockerRouter.js";
import updateRouter from "./src/Routers/UpdateRouter.js";
import acknowledgementRouter from "./src/Routers/AcknowledgementRouter.js";

app.use("/api/authentication", authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/action", actionRouter);
app.use("/api/blocker", blockerRouter);
app.use("/api/update", updateRouter);
app.use("/api/acknowledgement", acknowledgementRouter);

app.use((req, res, next) => {
  return notFoundResponse(res, `Cannot ${req.method} ${req.originalUrl}`);
});


app.use((error, req, res, next) => {
  return handleError(res, error);
});


export default app;