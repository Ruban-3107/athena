import { IsString, IsNumber, IsDateString,IsOptional,MinLength, MaxLength,Matches,IsDate } from 'class-validator';

export class CreateCertificationsDto {
  @IsNumber()
  public user_id: number;
  @IsString() 
  @MinLength(3, {
    message: 'Title is too short. Minimal length is 3 characters.',
  })
  @MaxLength(15, {
    message: 'Title is too long. Maximal length is 15 characters.',
  })
  @Matches(/^[a-zA-Z0-9-_])$/, {
    message:
      'title must be between 3 and 15 characters',
  })
  public title: string;
  @IsString() 
  public certificate_upload: string; 
  @IsString() 
  public provider_id: number;
  @IsDateString()
  public date_achieved: Date;
  @IsDateString()
  public date_expires: Date;
  @IsString()
  public description: string;

  @IsString()
  public certification_url: string;
  @IsString()
  public certification_type: string;
  @IsString()
  
  public certification_id: string;

  @IsString() @IsOptional()
  public create_provider: string;
}




export class UpdateCertificationsDto {

  @IsNumber() @IsOptional()
  public user_id: number;

  // @IsString() @IsOptional()
  // @MinLength(3, {
  //   message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
  // })
  // @MaxLength(15, {
  //   message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  // })
  // public title: string;



  @IsString() @IsOptional()
  public certificate_upload: string;


  @IsString() @IsOptional()
  // @MinLength(3, {
  //   message: 'Institute is too short. Minimal length is $constraint1 characters, but actual is $value',
  // })
  // @MaxLength(15, {
  //   message: 'Institute is too long. Maximal length is $constraint1 characters, but actual is $value',
  // })
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z]){3,15}$/gm, {
  //   message:
  //     'institute must be between 3 and 15 characters',
  // })
  public provider_id: number;


  @IsDateString() @IsOptional()
  public date_achieved: Date;


  @IsDateString() @IsOptional()
  public date_expires: Date;


  @IsString() @IsOptional()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,100}$/gm, {
  //   message:
  //     'description must be between 6 and 70 characters',
  // })
  public description: string;
  @IsString() @IsOptional()
  public certification_url: string;
  @IsString() @IsOptional()
  public certification_type: string;
  @IsString() @IsOptional()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{0,100}$/gm, {
  //   message:
  //      'certification_id must be between 0 and 100 characters',
  //  })
  public certification_id: string;

}
