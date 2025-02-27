import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentItemController } from './shipment-item.controller';

describe('ShipmentItemController', () => {
  let controller: ShipmentItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentItemController],
    }).compile();

    controller = module.get<ShipmentItemController>(ShipmentItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
