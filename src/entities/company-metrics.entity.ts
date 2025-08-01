import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_metrics')
export class CompanyMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column('decimal', { precision: 10, scale: 2 })
  market_cap: number;

  @Column('decimal', { precision: 5, scale: 2 })
  pe_ratio: number;

  @Column('decimal', { precision: 5, scale: 2 })
  dividend_yield: number;
}
