import { IsString } from "class-validator";



export class CreateTemplateDto{

    @IsString({ message: 'template_name must be a string' })
    template_name: string;

    @IsString({ message: 'template must be a string' })
    template: string;
}