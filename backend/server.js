import express from "express";
import cors from "cors";
import "dotenv/config";
import dbConnect from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import departmentRouter from "./routes/departmentRoute.js";
import userRouter from "./routes/userRoute.js";
import projectRouter from "./routes/projectRoute.js";
import projectLogRouter from "./routes/projectLogRoute.js";
import taskRouter from "./routes/taskRoute.js";
import performanceRouter from "./routes/performanceRoute.js";
import costRouter from "./routes/costRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
dbConnect();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoint
app.use("/api/admin", adminRouter);
app.use("/api/department", departmentRouter);
app.use("/api/user", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/project-log", projectLogRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/performances", performanceRouter);
app.use("/api/cost", costRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
