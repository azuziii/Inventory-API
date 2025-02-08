import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformNestedArrayPipe implements PipeTransform {
  constructor(
    private readonly property: string,
    private readonly itemPipe: PipeTransform,
  ) {}

  async transform(input: any, metadata: ArgumentMetadata) {
    const array = input[this.property];
    if (Array.isArray(array)) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        input[this.property][i] = await this.itemPipe.transform(item, metadata);
      }
    }
    return input;
  }
}
