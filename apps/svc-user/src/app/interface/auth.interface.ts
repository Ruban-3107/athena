import { Request } from 'express';
import { User } from './users.interface';
import { Json } from 'sequelize/types/utils';

export interface DataStoredInToken {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  isPasswordChanged: boolean;
  role: Json;
  first_name: string;
  last_name: string;
  handle: string;
  client_id: number;
}

export interface TokenData {
  access_token?: string;
  access_expiresIn?: number;
  refresh_expiresIn?: number;
  refresh_token?: string;
}

export interface TokenValidate {
  validate?: boolean;
}

export interface RequestWithUser extends Request {
  user?: User
  token?:string
  isNewUser?: boolean
  isAdminOrSuperAdmin?: boolean
}