import { IsString, IsOptional } from 'class-validator';

export class CreateDomainTechnologyDto {
  @IsString()
  @IsOptional()
  public blob_category: string;

  @IsString()
  @IsOptional()
  public name: string;
}

export class EditDomainTechnologyDto {
  @IsString()
  @IsOptional()
  public blob_category: string;

  @IsString()
  @IsOptional()
  public name: string;
}
