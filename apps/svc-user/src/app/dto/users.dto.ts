import {
    IsString,
    IsEmail,
    IsInt,
    IsArray,
    IsOptional,
    IsDate,
    IsNotEmpty,
    Length,
    Matches,
    IsPhoneNumber,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    @IsOptional()
    public athena_id: string;
    @IsEmail({}, { message: 'Enter valid email' })
    public email: string;
    @IsEmail({}, { message: 'Enter valid email' })
    @IsOptional()
    public personal_email: string;
  
    @IsString()
    @IsOptional()
    public password: string;
    @IsString()
    @IsOptional()
    public users_type: string;
    @IsString()
    @IsOptional()
    //@Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
    // @IsPhoneNumber()
    public phone_number?: string;
  
    @IsString()
    @IsOptional()
    public uid?: string;
    @IsString()
    @IsOptional()
    public handle: string;
  
    @IsNotEmpty({ message: 'First name cannot be empty' })
    @IsString({ message: 'First name must be a string' })
    @Length(3, 20, { message: 'First name must be between 3 and 20 characters' })
    @Matches(/^[a-zA-Z\s]+$/, {
      message: 'First name must contain only letters and whitespace',
    })
    public first_name: string;
  
    @IsNotEmpty({ message: 'Last name cannot be empty' })
    @IsString({ message: 'Last name must be a string' })
    @Length(1, 20, { message: 'Last name must be between 1 and 20 characters' })
    @Matches(/^[a-zA-Z\s]+$/, {
      message: 'Last name must contain only letters and whitespace',
    })
    public last_name: string;
  
    @IsInt()
    @IsOptional()
    public client_id?: number;
    @IsArray()
    @IsOptional()
    public roles?: number[];
    @IsInt()
    @IsOptional()
    public created_by: number;
    @IsInt()
    @IsOptional()
    public updated_by: number;
    @IsString()
    @IsOptional()
    public name: string;
    @IsBoolean()
    @IsOptional()
    public is_active: string;
  }
  
  