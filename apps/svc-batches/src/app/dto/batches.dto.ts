import {
  IsString,
  IsDateString,
  IsArray,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class CreateBatchesDto {
  @IsNotEmpty({ message: 'name cannot be empty' })
  @IsString({ message: 'name must be a string' })
  @Matches(/^[a-zA-Z0-9-\s]+$/, {
    message: 'name must contain only numbers and letters and whitespace',
  })
  public name: string;

  @IsString({ message: 'name must be a string' })
  public description: string;

  @IsDateString()
  public started_at: Date;

  @IsDateString()
  @IsOptional()
  public end_at: Date;

  @IsNumber(undefined, { message: 'Client Id must be a number' })
  public client_id: number;

  @IsNumber()
  @IsOptional()
  public training_facilitator: number;

  @IsNumber()
  @IsOptional()
  public client_representative: number;

  @IsArray()
  @IsOptional()
  public learners?: Array<number>;

  @IsArray()
  @IsOptional()
  public tracks_assigned?: Array<number>;

  @IsNumber()
  @IsOptional()
  public deleted_by: number;

  @IsNumber()
  @IsOptional()
  public created_by: number;
}

export class updateBatchStatusDto {
  @IsString({ message: 'status must be a string' })
  @IsOptional()
  public status: string;
}
