import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOrderInput, UpdateOrderInput } from '../dto/order-input.dto';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(order: CreateOrderInput): Promise<Order> {
    console.log(order);
    return this.orderRepository.save(order);
  }

  find(options?: FindManyOptions<Order>): Promise<Order[]> {
    return this.orderRepository.find(options);
  }

  findOne(options: FindOneOptions<Order>): Promise<Order | null> {
    return this.orderRepository.findOne(options);
  }

  listOrders(): Promise<[Order[], number]> {
    return this.orderRepository.findAndCount({
      relations: {
        customer: true,
      },
    });
  }

  async getOrder(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrder(input: UpdateOrderInput): Promise<Order> {
    const { id } = input;

    if (!id) {
      throw new BadRequestException('Order id is required');
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isEmpty = Object.keys(input).length === 1;

    if (isEmpty) {
      throw new BadRequestException('No fields provided to update');
    }

    Object.assign(order, input);
    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
