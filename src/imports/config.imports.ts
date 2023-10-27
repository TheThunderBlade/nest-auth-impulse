import { ConfigModule } from '@nestjs/config';

export default ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
});
