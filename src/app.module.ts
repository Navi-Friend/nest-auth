import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';

// const typeOrmProvider = {
//   provide: 'DATABASE_PROVIDER',
//   useFactory: async (configService: ConfigService) => {
//     const dataSource = new DataSource({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5433,
//       username: configService.get('POSTGRES_USER'),
//       password: '123456',
//       database: 'nestjs-test',
//       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       synchronize: true,
//     });
//     return dataSource.initialize();
//   },
//   inject: [ConfigService],
// };

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
