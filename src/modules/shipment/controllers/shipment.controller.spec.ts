import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentService } from '../services/shipment.service';
import { ShipmentController } from './shipment.controller';

describe('ShipmentController', () => {
  let controller: ShipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentController],
      providers: [ShipmentService],
    }).compile();

    controller = module.get<ShipmentController>(ShipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
