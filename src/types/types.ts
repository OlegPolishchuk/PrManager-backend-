export interface Token {
  sub: string; //id пользователя
  email: string;
  iat: number;
  exp: number;
}
