import swaggerAutogen from "swagger-autogen";

const autogen = swaggerAutogen();

const outputFile = "./src/swagger-output.json"; // Tạo file trong thư mục src
const endpointsFiles = ["./routes/index.js"];

const doc = {
  info: {
    title: "My API",
    description: "API documentation for my Express application",
    version: "1.0.0",
  },
  host: `localhost:${process.env.PORT || 3000}`,
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Default",
      description: "Default endpoints",
    },
  ],
  definitions: {},
};

// Tạo file swagger-output.json và xử lý lỗi
autogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log(`Swagger output file created successfully at ${outputFile}`);
  })
  .catch((err) => {
    console.error("Error generating Swagger output:", err);
  });