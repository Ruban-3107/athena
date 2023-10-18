import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateRoleDto {
    @IsString({message:"Name must be a string"})
    public name: string;

    @IsString({message:"Description must be a string "})
    public description: string;

    @IsArray()
    @IsOptional()
    public permissions?: object[];

} 
