import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSkillSetDto {
  @IsString({ message: 'Label must be a string' })
  public label: string;

  @IsString({ message: 'Value must be a string' })
  public value: string;
}

export class UpdateSkillSetDto {
  @IsString()
  @IsOptional()
  public label: string;

  @IsString()
  @IsOptional()
  public value: string;

  // @IsString()
  // public lable: string;

  // @IsDateString()
  // public created_at: Date;

  // @IsDateString()
  // public updated_at: Date;
}
