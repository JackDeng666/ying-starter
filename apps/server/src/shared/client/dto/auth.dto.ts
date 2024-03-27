import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

export class ClientLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string
}

export class ClientRegisterDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string
}

export class NewVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  token: string
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class NewPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  token: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string
}
