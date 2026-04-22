import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Article Project")
    .setDescription("Article Project for lesson")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
      },
      "JWT-auth", // Bu nom guardlarda ishlatiladi
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  app.use("/uploads", express.static("uploads"));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log("running at: http://localhost:" + PORT);
    console.log(`running at: http://localhost:${PORT}/api-docs`);
  });
}

void bootstrap();
