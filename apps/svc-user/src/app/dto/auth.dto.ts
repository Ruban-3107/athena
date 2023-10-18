import {
    IsString,
    IsEmail,
    IsInt,
    IsIn,
    IsArray,
    Matches,
    IsOptional,
    IsBoolean,
    IsPhoneNumber,
    IsNotEmpty,
    Length,
    Validate

} from 'class-validator';



export class SignInDto {
    @IsEmail(undefined, { message: 'Invalid email' })
    @IsOptional()
    @Validate((value: string) => /\S+@\S+\.\S+/.test(value), {
        message: "Email should be in format 'example@example.com'"
    })
    public email?: string;

    @IsString()
    public password: string;

    @IsString()
    @IsOptional()
    // @IsPhoneNumber()
    // @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Phone number must include a valid country code' })
    public phone_number?: string;

    @IsBoolean({ message: 'Is password changed must be a boolean value.' })
    @IsOptional()
    @IsIn([true,false])
    public is_password_changed?: boolean;

    @IsBoolean({ message: 'Is admin app must be a boolean value,i.e true or false' })
    @IsOptional()

    public is_admin_app?: boolean;
}

export class SignUpDto {


    @IsNotEmpty({ message: 'first_name cannot be empty' })
    @IsString({ message: 'first_name must be a string' })
    @Length(3, 20, { message: 'first_name must be between 3 and 20 characters' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'first_name must contain only letters and whitespace' })
    public first_name: string;


    @IsNotEmpty({ message: 'last_name cannot be empty' })
    @IsString({ message: 'last_name must be a string' })
    @Length(3, 20, { message: 'last_name must be between 3 and 20 characters' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'last_name must contain only letters and whitespace' })
    public last_name: string;

    @IsString()
    @IsOptional()
    public handle?: string;

    @IsEmail(undefined, { message: 'Invalid email' })
    @IsNotEmpty({ message: "email should not be empty" })

    @Validate((value: string) => /\S+@\S+\.\S+/.test(value), {
        message: "Email should be in format 'example@example.com'"
    })
    public email: string;


    //@IsEmail(undefined, { message: 'Invalid personal_email' })
    @IsOptional()
    //@IsNotEmpty({ message: "personal_email should not be empty" })
    @Validate((value: string) => /\S+@\S+\.\S+/.test(value), {
        message: "Personal email should be in format 'example@example.com'"
    })
    public personal_email: string;


    @IsString()
    @IsOptional()
    //@IsPhoneNumber()
    public phone_number?: string;

    @IsArray()
    @IsOptional()
    public roles: number[]


    @IsString()
    @IsOptional()
    @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    public password: string;

    @IsString()
    @IsOptional()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Confirm password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    public confirm_password: string;
}

export class setPasswordDto{
    @IsString()
    public old_password:string;

    @IsString()
    @IsOptional()
    @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    public password: string;

    @IsString()
    public confirm_password: string;

    @IsString()
    @IsOptional()
    public athena_id: string;
}

export class forgetPasswordDto {
    @IsEmail(undefined, { message: 'Invalid email' })
    @IsOptional()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        { message: "Enter valid email" }
    )
    @Validate((value: string) => /\S+@\S+\.\S+/.test(value), {
        message: "Email should be in format 'example@example.com'"
    })
    public email?: string;

    @IsBoolean({ message: 'Is password changed must be a boolean value.i.e true or false' })
    @IsOptional()
    public is_password_changed?: boolean;

    @IsBoolean({ message: 'Is admin app must be a boolean value,i.e true or false' })
    @IsOptional()
    public is_admin_app?: boolean;
}
