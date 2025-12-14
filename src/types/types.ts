import { Request } from 'express';

export interface Token {
  sub: string; //id пользователя
  email: string;
  iat: number;
  exp: number;
}

export interface RequestWithJWTPayload extends Request {
  user: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface PaginatedRequestFields {
  page: number;
  limit: number;
}
