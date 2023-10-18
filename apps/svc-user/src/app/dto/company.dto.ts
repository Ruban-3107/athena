import { IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsString({message:"Name must be a string"})
    public name: string;

} 