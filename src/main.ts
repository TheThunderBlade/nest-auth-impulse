import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from './pipes/validation.pipe';

async function start() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
start();
