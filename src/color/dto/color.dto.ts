import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Value is required' })
  value: string;
}
