import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';

async function bootstrap() {
  let app;
  if (process.env.ENVIROMENT === 'DEV') {
    console.log(process.env.CORS_ORIGIN.split(','));
    app = await NestFactory.create(AppModule, {
      cors: {
        origin: process.env.CORS_ORIGIN.split(','),
      },
    });
  } else {
    const httpsOptions = {
      key: fs.readFileSync('/usr/warlords/privkey.pem'),
      cert: fs.readFileSync('/usr/warlords/fullchain.pem'),
    };
    app = await NestFactory.create(AppModule, {
      httpsOptions,
      cors: {
        origin: process.env.CORS_ORIGIN.split(','),
      },
    });
  }
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
