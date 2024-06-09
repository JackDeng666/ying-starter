import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

export class ClientLoginDto {
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}

export class ClientRegisterDto {
  @IsNotEmpty({
    message: 'validation.nickname_should_not_be_empty'
  })
  name: string

  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}

export class NewVerificationDto {
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  email: string

  @IsNotEmpty({
    message: 'validation.token_should_not_be_empty'
  })
  token: string
}

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  email: string
}

export class NewPasswordDto {
  @IsNotEmpty({
    message: 'validation.email_should_not_be_empty'
  })
  @IsEmail(undefined, {
    message: 'validation.incorrect_email_format'
  })
  email: string

  @IsNotEmpty({
    message: 'validation.token_should_not_be_empty'
  })
  token: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'validation.incorrect_password_format'
  })
  @IsNotEmpty({
    message: 'validation.password_should_not_be_empty'
  })
  password: string
}
