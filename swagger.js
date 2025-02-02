const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const PORT = process.env.PORT || 3000

// Swagger Definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "API Documentation for Todo App",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./middleware/*.js","./config/*.js"], // Include route and model files for documentation
};

// Initialize Swagger Docs
const swaggerSpec = swaggerJsDoc(swaggerOptions);



const swaggerDocs = (app) => {
  app.use("/api-docs", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
};
module.exports = swaggerDocs;
