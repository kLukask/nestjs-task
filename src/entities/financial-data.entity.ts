import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('financial_data')
export class FinancialData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column('decimal', { precision: 10, scale: 2 })
  revenue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  profit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  assets: number;
}
