import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

// Sửa đường dẫn để trỏ đến file trong thư mục src
const swaggerOutput = JSON.parse(fs.readFileSync("./src/swagger-output.json", "utf-8"));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", routes);

// Route cho Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Route mặc định
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📖 Swagger UI is available at http://localhost:${PORT}/api-docs`);
});