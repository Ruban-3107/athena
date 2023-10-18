import { IsString,IsOptional, IsInt } from 'class-validator';

export class CreateActivitiesDto {

    @IsString({ message: "module_id must be string" })
    @IsOptional()
    public module_id: string;

    @IsString({ message: "module_type must be string" })
    @IsOptional()
    public module_type: string;

    @IsString({ message: "module_name must be string" })
    @IsOptional()
    public module_name: string;

    @IsString({ message: "action must be string" })
    @IsOptional()
    public action: string;

    @IsInt({ message: "user_id must be number" })
    @IsOptional()
    public user_id:number;

}