import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';

async function bootstrap() {
  let app;
  if (process.env.ENVIROMENT === 'DEV') {
    app = await NestFactory.create(AppModule);
  } else {
    const httpsOptions = {
      key: fs.readFileSync('/usr/warlords/privkey.pem'),
      cert: fs.readFileSync('/usr/warlords/fullchain.pem'),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  }
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
