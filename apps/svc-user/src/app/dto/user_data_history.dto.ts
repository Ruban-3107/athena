import {
    IsOptional,
    IsDate,
    IsNumber,
    IsBoolean,
} from 'class-validator';


 class Userdatahistory {
    @IsNumber(undefined, { message: 'User Id must be a number'})
    public user_id: number;

    @IsDate({ message: 'Sign up at must be a valid date' })
    public sign_up_at: Date;

    @IsBoolean()
    @IsOptional()
    public is_email_verified: boolean;

    @IsBoolean()
    @IsOptional()
    public is_password_changed: boolean;
}

export default Userdatahistory;

