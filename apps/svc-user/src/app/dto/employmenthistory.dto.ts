import {IsString, IsNumber,  IsDateString, MinLength, MaxLength, Matches, IsOptional} from 'class-validator';


export class CreateEmploymenthistoryDto {

    @IsNumber()
    public user_id: number;

  @IsString()
  // @MinLength(3, {
  //   message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
  // })
  // @MaxLength(40, {
  //   message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  // })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]){3,40}$/gm, {
    message:
      'company_name must be between 3 and 40 characters',
  })
    public company: string;

  @IsString()
  @MinLength(3, {
    message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(15, {
    message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]){3,15}$/gm, {
    message:
      'position must be between 3 and 15 characters',
  })
    public job_title: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,100}$/gm, {
    message:
      'job_description must be between 6 and 100 characters',
  })
    public job_description: string;

    @IsDateString()
    public start_month: Date;

    @IsDateString()
    public end_month: Date;
}
  
export class UpdateEmploymenthistoryDto {

  @IsNumber() @IsOptional()
  public user_id: number;

  @IsString() @IsOptional()
  // @MinLength(3, {
  //   message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
  // })
  // @MaxLength(40, {
  //   message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  // })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]){3,40}$/gm, {
    message:
      'company_name must be between 3 and 40 characters',
  })
  public company: string;

  @IsString() @IsOptional()
  @MinLength(3, {
    message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(15, {
    message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]){3,15}$/gm, {
    message:
      'position must be between 3 and 15 characters',
  })
  public job_title: string;

  @IsString() @IsOptional()
  @Matches(/^[a-zA-Z\s.]*$/)
  public job_description: string;

  @IsDateString() @IsOptional()
  public start_month: Date;

  @IsDateString() @IsOptional()
  public end_month: Date;
}

