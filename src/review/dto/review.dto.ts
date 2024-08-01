import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString({
    message: 'Text should be a string',
  })
  @IsNotEmpty({
    message: 'Text should be a string',
  })
  text: string;

  @IsNumber({}, { message: 'Please enter a valid rating' })
  @Min(1, { message: 'Please enter a valid minimal rating - 1' })
  @Max(5, { message: 'Please enter a valid minimal rating - 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;
}
