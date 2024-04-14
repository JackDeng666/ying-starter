import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

export class ClientLoginDto {
  @IsEmail(undefined, {
    message: 'Incorrect email format'
  })
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'Incorrect password format'
  })
  @IsNotEmpty({
    message: 'Password should not be empty'
  })
  password: string
}

export class ClientRegisterDto {
  @IsNotEmpty({
    message: 'Nickname should not be empty'
  })
  name: string

  @IsEmail(undefined, {
    message: 'Incorrect email format'
  })
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'Incorrect password format'
  })
  @IsNotEmpty({
    message: 'Password should not be empty'
  })
  password: string
}

export class NewVerificationDto {
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  @IsEmail(undefined, {
    message: 'Incorrect email format'
  })
  email: string

  @IsNotEmpty({
    message: 'Token should not be empty'
  })
  token: string
}

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  @IsEmail(undefined, {
    message: 'Incorrect email format'
  })
  email: string
}

export class NewPasswordDto {
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  @IsEmail(undefined, {
    message: 'Incorrect email format'
  })
  email: string

  @IsNotEmpty({
    message: 'Token should not be empty'
  })
  token: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'Incorrect password format'
  })
  @IsNotEmpty({
    message: 'Password should not be empty'
  })
  password: string
}
