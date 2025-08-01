import { Injectable } from '@nestjs/common';
import { Engine } from 'json-rules-engine';
import { QueryDecision } from '../interfaces/query-decision.interface';

@Injectable()
export class RulesEngineService {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
    this.setupRules();
  }

  private setupRules() {
    // Rule for financial data table
    this.engine.addRule({
      conditions: {
        any: [
          {
            fact: 'dataPoint',
            operator: 'in',
            value: ['revenue', 'profit', 'assets'],
          },
        ],
      },
      event: {
        type: 'financial-data-table',
        params: {
          tableName: 'financial_data',
        },
      },
    });

    // Rule for company metrics table
    this.engine.addRule({
      conditions: {
        any: [
          {
            fact: 'dataPoint',
            operator: 'in',
            value: ['market_cap', 'pe_ratio', 'dividend_yield'],
          },
        ],
      },
      event: {
        type: 'company-metrics-table',
        params: {
          tableName: 'company_metrics',
        },
      },
    });

    // Rule for market data table
    this.engine.addRule({
      conditions: {
        any: [
          {
            fact: 'dataPoint',
            operator: 'in',
            value: ['current_price', 'volume', 'price_change_percent'],
          },
        ],
      },
      event: {
        type: 'market-data-table',
        params: {
          tableName: 'market_data',
        },
      },
    });
  }

  async determineTable(dataPoint: string): Promise<QueryDecision> {
    const facts = { dataPoint };
    const results = await this.engine.run(facts);

    if (results.events.length === 0) {
      throw new Error(`No matching table found for data point: ${dataPoint}`);
    }

    const event = results.events[0];
    return {
      tableName: event.params.tableName,
      dataPoint: dataPoint,
    };
  }
}
