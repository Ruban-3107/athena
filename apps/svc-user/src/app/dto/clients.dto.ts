import { IsString, IsInt, IsEmail, IsArray, IsOptional, ValidateNested, Matches } from 'class-validator';

export class CreateClientsDto {
    @IsString()
    // @Matches(/^[ A-Za-z-]{1,20}$/, {
    //     message:
    //         'Corporate group length should be 1 to 20 characters, numbers are not allowed and (-) is allowed ',
    // })
    public corporate_group: string;

    @IsString()
    // @Matches(/^[ A-Za-z]{1,15}$/, {
    //     message:
    //     'Company name length should be 1 to 15 characters, numbers and special characters are not allowed',
    // })
    public company_name: string;


    @IsString()
    @IsOptional()
    // @Matches(/^[ A-Za-z0-9]{1,15}$/, {
    //     message:
    //         'address_line_1 must be between 1 and 15 characters',
    // })
        
    public address_line_1: string;

    @IsString()
    @IsOptional()
    // @Matches(/^[ A-Za-z0-9]{0,15}$/, {
    //     message:
    //         'address_line_2 must be between 0 and 15 characters',
    // })
    public address_line_2: string;

    @IsString()
    @IsOptional()
    // @Matches(/^[ A-Za-z0-9]{1,15}$/, {
    //     message:
    //         'state is required and must be between 3 and 15 characters',
    // })
    public state: string;

    @IsString()
    @IsOptional()
    // @Matches(/^[ A-Za-z0-9]{1,15}$/, {
    //     message:
    //         'country is required and must be between 3 and 15 characters',
    // })
    public country: string;

    @IsArray()
   // @ValidateNested({each:true})
    public contact_details: [
                {
                    "first_name": string,
                    "last_name": string,
                    "primary_email": string,
                    "secondary_email": string,
                    "mobile_number": string,
                    "is_primary": boolean
                }
            
    ];


    @IsString()
    @IsOptional()
    public group_id: string;

   


}
