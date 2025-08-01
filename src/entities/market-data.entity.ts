import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('market_data')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column('decimal', { precision: 10, scale: 2 })
  current_price: number;

  @Column('bigint')
  volume: number;

  @Column('decimal', { precision: 5, scale: 2 })
  price_change_percent: number;
}
