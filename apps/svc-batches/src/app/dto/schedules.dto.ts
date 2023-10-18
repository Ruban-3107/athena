import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateScheduleDto {
  @IsDateString()
  public start_at: Date;

  @IsDateString()
  public end_at: Date;

  @IsString({ message: 'Description must be string' })
  @IsOptional()
  public description: string;

  @IsNumber({}, { message: 'Topic ID must be number' })
  @IsOptional()
  public topic_id: number;

  @IsNumber({}, { message: 'Trainer ID must be number' })
  @IsOptional()
  public trainer_id: number;

  @IsNumber({}, { message: 'Batch ID must be a number' })
  @IsOptional()
  public batch_id: number;

  @IsNumber({}, { message: 'Learner Track id must be a number' })
  @IsOptional()
  public learner_track_id: number[];

  @IsArray()
  @IsOptional()
  public learner_id: number[];

  @IsNumber({}, { message: 'Track ID must be a number' })
  @IsOptional()
  public track_id: number;

  @IsNumber({}, { message: 'Chapter ID must be a number' })
  @IsOptional()
  public chapter_id: number;

  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  public status: string;

  @IsString({ message: 'Reason must be a string' })
  @IsOptional()
  public reason_for_cancellation: string;

  @IsString({ message: 'topic_name  must be a string' }) 
  @IsOptional()
  public topic_name : string;

  @IsString({ message: 'trainer_name  must be a string' }) 
  @IsOptional()
  public trainer_name : string;

  @IsString({ message: 'batch_name  must be a string' }) 
  @IsOptional()
  public batch_name : string;

  @IsOptional()
  public date : object;
}
