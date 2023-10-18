import { IsDateString, IsInt, IsString, IsOptional,IsBoolean, IsObject, IsDate, IsArray, IsEnum  } from 'class-validator';

export class CreateTopicDto {
    @IsInt()
    @IsOptional()
    public approved_by: number;

    @IsDateString()
    @IsOptional()
    public approved_at: Date;

    @IsArray()
    @IsOptional()
    public ids: object;

    @IsString()
    @IsOptional()
    public topic_type: string;

    @IsString()
    @IsOptional()
    public topic_link: string;

    @IsString()
    @IsOptional()
    public created_by: string;

    @IsString()
    @IsOptional()
    public updated_by: string;

    @IsString()
    @IsOptional()
    public deleted_by: string;

    @IsDate()
    @IsOptional()
    public deleted_at: Date;

    @IsString()
    @IsOptional()
    public title: string;


    @IsInt()
    @IsOptional()
    public exercise_id: number;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public description: string;

    @IsString()
    @IsOptional()
    public duration: string;

    @IsString()
    @IsOptional()
    public attachment_url : string;

    @IsBoolean()
    @IsOptional()
    public same_day : boolean;

    // @IsString() @IsOptional()
    // public strapi_data : string;

    @IsString() @IsOptional()
    public version: string;
    
    @IsString() @IsOptional()
    public unique_topic_id: string;

    @IsString() @IsOptional()
    public is_edited: boolean;

    @IsString()
    @IsOptional()
    public delivery_type: string;

    @IsString()
    @IsOptional()
    public technology_skills: string;

    @IsString()
    @IsOptional()
    public level: string;

    @IsString()
    @IsOptional()
    public attachment_pdf_url: string;
    
    @IsString()
    @IsOptional()
    public s3_bucket_pdf_filekey: string;

    @IsString()
    @IsOptional()
    public s3_bucket_filekey: string;

    @IsString()
    @IsOptional()
    public to_be_reviewed_by: string;
}
