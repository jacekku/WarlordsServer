import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  let app;
  if (process.env.ENVIRONMENT === 'DEV') {
    app = await NestFactory.create(AppModule, {
      cors: {
        origin: process.env.CORS_ORIGIN.split(','),
      },
    });
  } else {
    app = await NestFactory.create(AppModule, {
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
