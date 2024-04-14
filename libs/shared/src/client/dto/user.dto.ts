import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator'

export class ResetPasswordDto {
  @IsOptional()
  oldPassword: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'Incorrect password format'
  })
  @IsNotEmpty({
    message: 'New password should not be empty'
  })
  newPassword: string
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Nickname should not be empty'
  })
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}
