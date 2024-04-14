import { IsNotEmpty, Matches } from 'class-validator'

export class AdminLoginDto {
  @IsNotEmpty()
  username: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string
}
