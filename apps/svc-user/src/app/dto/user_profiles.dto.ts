import { IsString, IsEmail, IsNumber, MinLength, MaxLength, Matches, IsOptional, IsArray, IsDateString, IsJSON, IsNotEmpty,Length, IsPhoneNumber, IsUrl } from 'class-validator';
import { isContext } from 'vm';

export class CreateUserProfileDto {

  @IsNumber()
  public user_id: number;

  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  @Length(3, 20, { message: 'First name must be between 3 and 20 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name must contain only letters and whitespace' })
  public first_name: string;
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 20, { message: 'Last name must be between 1 and 20 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name must contain only letters and whitespace' })
  public last_name: string;
  @IsDateString()
  @IsOptional()
  public experience_updated_at: Date;

  @IsEmail({}, { message: 'Enter valid email' })
  public contact_email: string;

  @IsString()
  @IsPhoneNumber()
  public phone_number: string;

  @IsOptional() @IsString()
  public alternate_phone_number: string;

  @IsString() @IsOptional()
  public alternate_email: string;

  @IsString()
  @IsOptional()
    @Matches(/^[@#$%^&+=][a-zA-Z0-9]{3,40}$/, {
        message:
          'Address line 1 must be between 3 and 40 characters',
      })
  public address_line_1: string;

  @IsString()
  @IsOptional()
  @Matches(/^[@#$%^&+=][a-zA-Z0-9]{3,40}$/, {
    message:
      'Address line 2 must be between 3 and 40 characters',
  })
  public address_line_2: string;

  @IsString() @IsOptional()
    @Matches(/^[a-zA-Z]{3,15}$/, {
        message:
          'City is required and must be between 3 and 15 characters',
      })
  public city: string;

  @IsString() @IsOptional()
    @Matches(/^[a-zA-Z]{3,15}$/, {
        message:
          'State is required and must be between 3 and 15 characters',
      })
  public state: string;

  @IsString()
  @IsOptional()
    @Matches(/^[0-9]{1,10}$/, {
        message:
          'Pincode is required and must be between 1 and 10 characters.',
      })
  public pincode: string;

  @IsString() @IsOptional()
    @Matches(/^([a-zA-Z]){3,15}$/, {
        message:
          'Country is required and must be between 3 and 15 characters',
      })
  public country: string;

  @IsString() @IsOptional()
    @Matches(/^[@#$%^&+=a-zA-Z0-9]{0,3500}$/, {
        message:
          'About me must be between 0 and 3500 characters',
      })
  public about_me: string;

  @IsJSON() @IsOptional()
  public preferences: JSON;

  @IsNumber() @IsOptional()
  public years_of_experience: number;


  @IsString() @IsOptional()
 @IsUrl({},{message:"Enter valid Twitter URL"})
  public twitter: string;


  @IsString() @IsOptional()
  @IsUrl({}, { message: "Enter valid facebook URL" })
  public facebook: string;

  @IsString() @IsOptional()
  @IsUrl({}, { message: "Enter valid github URL" })
  public github: string;

  @IsString() @IsOptional()
  public education:string;


  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Enter valid github URL"})
  public linkedin: string;

  @IsString() @IsOptional()
    @Matches(/^([a-zA-Z]){0,256}$/, {
        message:
          'medium must be between 0 and 20 characters',
      })
  public medium: string;


  @IsArray() @IsOptional()
  public skillset?: object[];

  @IsString() @IsOptional()
  public image_url?: string;


}


export class UpdateUserProfileDto {

  @IsNumber()
  public user_id: number;

  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(3, 20, { message: 'First name must be between 3 and 20 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name must contain only letters and whitespace' })
  public first_name: string;

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 20, { message: 'Last name must be between 1 and 20 characters' })
  @IsOptional()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name must contain only letters and whitespace' })
  public last_name: string;

  @IsDateString()
  @IsOptional()
  public experience_updated_at: Date;


  @IsEmail({},{message:"Enter valid email"})
  @IsOptional()
  public contact_email: string;

  @IsNumber()
  public years_of_experience: number;

  @IsString() @IsOptional()
  @IsPhoneNumber()
  public phone_number: string;

  @IsString() @IsOptional()
  @IsPhoneNumber()
  public alternate_phone_number: string;

  @IsEmail({}, { message: "Enter valid email" })
  @IsOptional()
  public alternate_email: string;


  @IsString()
  @IsOptional()
  @Matches(/^[@#$%^&+=][a-zA-Z0-9]{3,40}$/, {
    message:
      'Address line 1 must be between 3 and 40 characters',
  })
  public address_line_1: string;

  @IsString()
  @IsOptional()
  @Matches(/^[@#$%^&+=][a-zA-Z0-9]{3,40}$/, {
    message:
      'Address line 2 must be between 3 and 40 characters',
  })
  public address_line_2: string;

  @IsString() @IsOptional()
  @Matches(/^[a-zA-Z]{3,15}$/, {
    message:
      'City is required and must be between 3 and 15 characters',
  })
  public city: string;

  @IsString() @IsOptional()
  @Matches(/^[a-zA-Z]{3,15}$/, {
    message:
      'State is required and must be between 3 and 15 characters',
  })
  public state: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{1,10}$/, {
    message:
      'Pincode is required and must be between 1 and 10 characters.',
  })
  public pincode: string;


  @IsString() @IsOptional()
  @Matches(/^([a-zA-Z]){3,15}$/, {
    message:
      'Country is required and must be between 3 and 15 characters',
  })
  public country: string;

  @IsString() @IsOptional()
  @Matches(/^[@#$%^&+=a-zA-Z0-9]{0,3500}$/, {
    message:
      'About me must be between 0 and 3500 characters',
  })
  public about_me: string;
  @IsString() @IsOptional()
  @IsUrl({}, { message: "Enter valid Twitter URL" })
  public twitter: string;


  @IsString() @IsOptional()
  @IsUrl({}, { message: "Enter valid facebook URL" })
  public facebook: string;

  @IsString() @IsOptional()
  @IsUrl({}, { message: "Enter valid github URL" })
  public github: string;


  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Enter valid github URL" })
  public linkedin: string;


  @IsString() @IsOptional()
  @Matches(/([a-zA-Z]){0,20}$/, {
    message:
      'medium must be between 0 and 20 characters',
  })
  public medium: string;


}