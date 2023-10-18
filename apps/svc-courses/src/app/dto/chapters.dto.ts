import {
  IsNumber,
  IsDateString,
  IsInt,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateChapterDto {
  @IsString({ message: 'Title must be a string' })
  public title: string;

  @IsInt()
  @IsOptional()
  public approved_by: number;

  @IsDateString()
  @IsOptional()
  public approved_at: Date;

  @IsString({ message: 'Description must be string' })
  @IsOptional()
  public description: string;

  @IsString({ message: 'Slug must be string' })
  public slug: string;

  @IsString({ message: 'Status must be string' })
  @IsOptional()
  public status: string;

  @IsString({ message: 'level must be string' })
  @IsOptional()
  public level: string;

  @IsString({ message: 'technology_skills must be string' })
  @IsOptional()
  public technology_skills: string;

  @IsArray()
  @IsOptional()
  public topics?: Array<number>;

  @IsString()
  @IsOptional()
  public approver?: string;

  @IsString({ message: 'reviewed by must be int' })
  @IsOptional()
  public to_be_reviewed_by: string;

  @IsString()
  @IsOptional()
  public created_by: number;
}
