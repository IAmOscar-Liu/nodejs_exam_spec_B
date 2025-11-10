import swaggerJsDoc from "swagger-jsdoc";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node exam API",
      version: "1.0.0",
      description: "This is the documentation for the Node exam API",
    },
  },
  apis: ["./src/router/user.ts", "./src/router/service.ts"],
};

export const swaggerSpec = swaggerJsDoc(options);
