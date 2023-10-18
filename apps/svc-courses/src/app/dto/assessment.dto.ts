import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export default class CreateAssessmentDto {
  @IsString({ message: 'title must be string' })
  public title: string;

  @IsString({ message: 'technology_skills is Required' })
  public technology_skills: string;

  @IsString({ message: 'question must be string' })
  public question: string;

  @IsArray()
  public options: [{ option: string; answer: boolean }];
}
