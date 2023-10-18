import { IsString } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    public name: string;

    @IsString()
    public menu: string;

} 
