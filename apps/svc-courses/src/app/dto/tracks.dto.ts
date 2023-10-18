import {
    IsNumber,
    IsString,
    IsArray,
    IsOptional,
    IsBoolean,
    IsDate,
    IsInt,
    IsDateString,
    Matches,
} from 'class-validator';

export class CreateTrackDto {
    @IsInt() @IsOptional()
      public approved_by: number;

    @IsDateString() @IsOptional()
    public approved_at: Date;

    @IsString()
    @IsOptional()
    public slug: string;

    @IsString({ message: 'Title is required' })
    // @Matches(/^[a-zA-Z0-9\s]*$/, {
    //   message: 'Title should not contain special characters or emojis',
    // })
    public title: string;

    @IsString()
    @IsOptional()
    public blurb: string;

    @IsString()
    @IsOptional()
    public repo_url: string;

    @IsString()
    @IsOptional()
    public synced_to_git_sha: string;

    @IsNumber()
    @IsOptional()
    public num_exercises: number;

    @IsNumber()
    @IsOptional()
    public num_concepts: number;

    @IsArray()
    @IsOptional()
    public tags?: object[];

    @IsBoolean()
    @IsOptional()
    public active: boolean;

    @IsNumber()
    @IsOptional()
    public num_students: number;

    @IsNumber()
    @IsOptional()
    public median_wait_time: number;

    @IsBoolean()
    @IsOptional()
    public course: boolean;

    @IsBoolean()
    @IsOptional()
    public has_test_runner: boolean;

    @IsBoolean()
    @IsOptional()
    public has_representer: boolean;

    @IsBoolean()
    @IsOptional()
    public has_analyzer: boolean;

    @IsString()
    @IsOptional()
    public status: string;

    @IsString()
    public track_type: string;

    @IsString()
    @IsOptional()
    public track_category: string;

    @IsArray()
    @IsOptional()
    public chapters?: any;

    @IsArray()
    @IsOptional()
    public children?: any;

    @IsString()
    @IsOptional()
    public image_url: string;
    @IsString()
    @IsOptional()
    public created_by: number;

    @IsString()
    public level: string;

    @IsString()
    public permission: string;

    @IsString()
    @IsOptional()
    public technology_skills?: string;

    @IsString()
    @IsOptional()
    public prerequisites?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
  public approver?: string;
  
  @IsString()
  @IsOptional()
  public to_be_reviewed_by?: string;
}
