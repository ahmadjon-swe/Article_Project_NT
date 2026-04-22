import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiGatewayTimeoutResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgotPassword-auth.dto';
import { VerifyForgotPasswordAuthDto } from './dto/verify-forgotPassword-auth.dto';

// Controller /////////////////////////////////////////////////////////////////////////////////////////////////

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({type: CreateAuthDto})
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'Please check your email',
      },
    },
  })
  @ApiBadRequestResponse({description: 'User already exists'})
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  // LOGIN /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('login')
  @ApiOperation({ summary: 'Login and send OTP' })
  @ApiBody({type: LoginAuthDto})
  @ApiOkResponse({
    description: 'OTP sent to email',
    schema: {
      example: {
        message: 'we send code to your email',
      },
    },
  })
  @ApiBadRequestResponse({description: 'User not found or password incorrect'})
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  // VERIFY /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP and get token' })
  @ApiBody({type: VerifyAuthDto})
  @ApiOkResponse({
    description: 'User verified successfully',
    schema: {
      example: {
        message: 'you have successfully logged in',
        token: 'jwt_token_here',
      },
    },
  })
  @ApiBadRequestResponse({description: 'Invalid OTP or user error'})
  @ApiGatewayTimeoutResponse({description: 'OTP expired'})
  verify(@Body() dto: VerifyAuthDto) {
    return this.authService.verify(dto);
  }

  // FORGOT PASSWORD /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP for password reset' })
  @ApiBody({type: ForgotPasswordAuthDto})
  @ApiOkResponse({
    description: 'OTP sent for password reset',
    schema: {
      example: {
        message: 'we have send you email to change your password',
      },
    },
  })
  @ApiBadRequestResponse({description: 'User not found'})
  forgotPassword(@Body() dto: ForgotPasswordAuthDto) {
    return this.authService.forgotPassword(dto);
  }

  // FORGOT PASSWORD VERIFY /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('forgot-password/verify')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiBody({type: VerifyForgotPasswordAuthDto})
  @ApiOkResponse({
    description: 'Password updated successfully',
    schema: {
      example: {
        message: 'your password has been updated'
      },
    },
  })
  @ApiBadRequestResponse({description: 'Invalid OTP or user error'})
  @ApiGatewayTimeoutResponse({description: 'OTP expired'})
  forgotPasswordVerify(@Body() dto: VerifyForgotPasswordAuthDto) {
    return this.authService.forgotPasswordVerify(dto);
  }
}