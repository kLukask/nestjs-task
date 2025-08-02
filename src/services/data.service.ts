import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialData } from '../entities/financial-data.entity';
import { CompanyMetrics } from '../entities/company-metrics.entity';
import { MarketData } from '../entities/market-data.entity';
import { RulesEngineService } from './rules-engine.service';
import { QueryDecision } from '../interfaces/query-decision.interface';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(FinancialData)
    private financialDataRepository: Repository<FinancialData>,
    @InjectRepository(CompanyMetrics)
    private companyMetricsRepository: Repository<CompanyMetrics>,
    @InjectRepository(MarketData)
    private marketDataRepository: Repository<MarketData>,
    private rulesEngineService: RulesEngineService,
  ) {}

  async getDataPoint(
    ticker: string,
    dataPoint: string,
    tableName?: string,
  ): Promise<any> {
    let decision: QueryDecision;

    if (tableName) {
      decision = { tableName, dataPoint };
    } else {
      decision = await this.rulesEngineService.determineTable(dataPoint);
    }

    const { tableName: determinedTable, dataPoint: determinedDataPoint } =
      decision;

    switch (determinedTable) {
      case 'financial_data':
        return this.queryFinancialData(ticker, determinedDataPoint);
      case 'company_metrics':
        return this.queryCompanyMetrics(ticker, determinedDataPoint);
      case 'market_data':
        return this.queryMarketData(ticker, determinedDataPoint);
      default:
        throw new Error(`Unknown table: ${determinedTable}`);
    }
  }

  private async queryFinancialData(
    ticker: string,
    dataPoint: string,
  ): Promise<any> {
    const result = await this.financialDataRepository.findOne({
      where: { ticker },
    });

    if (!result) {
      throw new Error(
        `No data found for ticker ${ticker} in financial_data table`,
      );
    }

    if (!(dataPoint in result)) {
      throw new Error(
        `Data point ${dataPoint} not found in financial_data table`,
      );
    }

    return {
      ticker,
      dataPoint,
      tableName: 'financial_data',
      value: result[dataPoint as keyof FinancialData],
    };
  }

  private async queryCompanyMetrics(
    ticker: string,
    dataPoint: string,
  ): Promise<any> {
    const result = await this.companyMetricsRepository.findOne({
      where: { ticker },
    });

    if (!result) {
      throw new Error(
        `No data found for ticker ${ticker} in company_metrics table`,
      );
    }

    if (!(dataPoint in result)) {
      throw new Error(
        `Data point ${dataPoint} not found in company_metrics table`,
      );
    }

    return {
      ticker,
      dataPoint,
      tableName: 'company_metrics',
      value: result[dataPoint as keyof CompanyMetrics],
    };
  }

  private async queryMarketData(
    ticker: string,
    dataPoint: string,
  ): Promise<any> {
    const result = await this.marketDataRepository.findOne({
      where: { ticker },
    });

    if (!result) {
      throw new Error(
        `No data found for ticker ${ticker} in market_data table`,
      );
    }

    if (!(dataPoint in result)) {
      throw new Error(`Data point ${dataPoint} not found in market_data table`);
    }

    return {
      ticker,
      dataPoint,
      tableName: 'market_data',
      value: result[dataPoint as keyof MarketData],
    };
  }

  async seedData(): Promise<void> {
    await this.financialDataRepository.save([
      {
        ticker: 'AAPL',
        revenue: 394328,
        profit: 96995,
        assets: 352755,
      },
      {
        ticker: 'GOOGL',
        revenue: 307394,
        profit: 76033,
        assets: 402392,
      },
    ]);

    await this.companyMetricsRepository.save([
      {
        ticker: 'AAPL',
        market_cap: 3000,
        pe_ratio: 30,
        dividend_yield: 0.5,
      },
      {
        ticker: 'GOOGL',
        market_cap: 180,
        enterprise_value: 185,
        pe_ratio: 25,
        dividend_yield: 0.0,
      },
    ]);

    await this.marketDataRepository.save([
      {
        ticker: 'AAPL',
        current_price: 190.5,
        volume: 500,
        price_change_percent: 2.5,
      },
      {
        ticker: 'GOOGL',
        current_price: 145.8,
        volume: 25,
        price_change_percent: -1.2,
      },
    ]);
  }
}
