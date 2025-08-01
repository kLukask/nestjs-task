import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DataService } from '../services/data.service';
import { GetDataPointDto } from '../dto/get-data-point.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('point')
  async getDataPoint(@Query() query: GetDataPointDto) {
    const { ticker, dataPoint, tableName } = query;
    try {
      if (!ticker || !dataPoint) {
        throw new HttpException(
          'Missing required parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.dataService.getDataPoint(
        ticker,
        dataPoint,
        tableName,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Instead of manually entering data through a client,
  // we can use this to populate the database with mock data
  @Get('seed')
  async seedData() {
    try {
      await this.dataService.seedData();
      return {
        success: true,
        message: 'Data seeded successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
