import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataController } from './controllers/data.controller';
import { DataService } from './services/data.service';
import { RulesEngineService } from './services/rules-engine.service';
import { FinancialData } from './entities/financial-data.entity';
import { CompanyMetrics } from './entities/company-metrics.entity';
import { MarketData } from './entities/market-data.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // Use the service name defined in docker-compose
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'platforma_homework_db',
      entities: [FinancialData, CompanyMetrics, MarketData], // This is correct
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([FinancialData, CompanyMetrics, MarketData]),
  ],
  controllers: [AppController, DataController],
  providers: [AppService, DataService, RulesEngineService],
})
export class AppModule {}
