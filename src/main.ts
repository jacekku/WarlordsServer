import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';
import { RolesGuard } from './auth/roles.guard';

async function bootstrap() {
  let app;
  if (process.env.ENVIRONMENT === 'DEV') {
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
  // app.useGlobalGuards(new RolesGuard());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
