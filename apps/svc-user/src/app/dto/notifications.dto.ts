import { IsNumber, IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateNotificationsDto {
  @IsNumber()
  public user_id: number;

  @IsBoolean()
  public email: boolean;

  @IsBoolean()
  public sms: boolean;

  @IsBoolean()
  public whats_app: boolean;

  @IsOptional()
  notifications_for: {
    value: any;
  };
}
