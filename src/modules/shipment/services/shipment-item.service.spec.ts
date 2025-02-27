import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentItemService } from './shipment-item.service';

describe('ShipmentItemService', () => {
  let service: ShipmentItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipmentItemService],
    }).compile();

    service = module.get<ShipmentItemService>(ShipmentItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
