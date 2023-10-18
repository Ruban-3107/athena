import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateBotQuestionsAnswersDto {
  @IsString({message:"Question must be string"})
  @IsOptional()
  public question: string;

  @IsString({message:"Answer must be string"})
  @IsOptional()
  public answer: string;
}
