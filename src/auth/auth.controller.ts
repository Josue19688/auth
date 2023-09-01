import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { ActivateUserDto } from './dto/activated-user.tdo';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetPassword } from './dto/validate-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('activate-account')
  activateAccount(@Query() activateUserDto: ActivateUserDto) {
    return this.authService.activateUser(activateUserDto);
  }

  @Patch('reset-password')
  resetPassword(
    @Body() resetPasswordDto:ResetPasswordDto
  ){
    return this.authService.resetPasswordToken(resetPasswordDto);
  }

  @Patch('validate-reset-password')
  validatePassword(
    @Body() validateResetPassword:ValidateResetPassword
  ){
    return this.authService.validatePassword(validateResetPassword);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
