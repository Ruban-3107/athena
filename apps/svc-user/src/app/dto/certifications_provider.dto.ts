import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateCertificationsProviderDto {
  @IsString()
  public logo: string;

  @IsString()
  public label: string;

  @IsString()
  public value: string;
}

export class UpdateCertificationsProviderDto {
  @IsString()
  @IsOptional()
  public logo: string;

  @IsString()
  @IsOptional()
  public label: string;

  @IsString()
  @IsOptional()
  public value: string;
}
