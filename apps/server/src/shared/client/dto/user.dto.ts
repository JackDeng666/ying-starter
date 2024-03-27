import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator'

export class ResetPasswordDto {
  @IsOptional()
  @IsEmpty()
  oldPassword: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  newPassword: string
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}
