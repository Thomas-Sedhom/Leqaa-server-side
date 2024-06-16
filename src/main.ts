import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS (replace with your specific origin(s))
  app.enableCors({
    // origin: (origin, callback) => {
      // Allow requests from 'http://localhost:3000' and 'file://' origins
    //   if ( origin === 'null') {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: 'null',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}

bootstrap();