import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from '../../src/controllers/data.controller';
import { DataService } from '../../src/services/data.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('DataController', () => {
  let controller: DataController;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [
        {
          provide: DataService,
          useValue: {
            getDataPoint: jest.fn(),
            seedData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DataController>(DataController);
    dataService = module.get<DataService>(DataService);
  });

  describe('getDataPoint', () => {
    it('should return data on success', async () => {
      const mockResult = { foo: 'bar' };
      (dataService.getDataPoint as jest.Mock).mockResolvedValue(mockResult);
      const result = await controller.getDataPoint(
        'AAPL',
        'price',
        'market_data',
      );
      expect(result).toEqual({ success: true, data: mockResult });
      expect(dataService.getDataPoint).toHaveBeenCalledWith(
        'AAPL',
        'price',
        'market_data',
      );
    });

    it('should throw if required params are missing', async () => {
      await expect(controller.getDataPoint('', 'price')).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getDataPoint('AAPL', '')).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle service errors', async () => {
      (dataService.getDataPoint as jest.Mock).mockRejectedValue(
        new Error('Service error'),
      );
      await expect(controller.getDataPoint('AAPL', 'price')).rejects.toThrow(
        HttpException,
      );
      try {
        await controller.getDataPoint('AAPL', 'price');
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(e.getResponse()).toEqual({
          success: false,
          message: 'Service error',
        });
      }
    });
  });
});
