// A DTO is an object that specifies how data should be sent over the network.
import { IsString, IsNumber } from 'class-validator';
export class CreateCatDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  breed: string;
}

export class UpdateCatDto {
  id?: string | number;
}
export class ListAllEntities {
  limit?: number;
}

//  Classes are part of the JavaScript ES6 standard, so they remain intact as real entities in the compiled JavaScript. In contrast, TypeScript interfaces are removed during transpilation, meaning Nest can't reference them at runtime. This is important because features like Pipes rely on having access to the metatype of variables at runtime, which is only possible with classes.
