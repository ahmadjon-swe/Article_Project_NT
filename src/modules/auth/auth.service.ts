import {BadRequestException, GatewayTimeoutException, Injectable} from "@nestjs/common";
import {CreateAuthDto} from "./dto/create-auth.dto";
import {Auth} from "./entities/auth.entity";
import * as bcrypt from 'bcrypt'
import { otpSender } from "src/shared/utils/node-mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ForgotPasswordAuthDto } from "./dto/forgotPassword-auth.dto";
import { VerifyForgotPasswordAuthDto } from "./dto/verify-forgotPassword-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepo:  Repository<Auth>,
    private jwtService: JwtService
  ) {}

  // register
  async register(createAuthDto: CreateAuthDto) {
    const {username, email, password} = createAuthDto;
    const foundedUser = await this.authRepo.findOne({
      where: 
         [{username}, {email}],
      
    });

    if(foundedUser) throw new BadRequestException("user already exist")
    
    const hash = await bcrypt.hash(password, 14)

    const otpTime = Date.now()+120000
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    const user =  this.authRepo.create({username, email, password: hash, otp, otpTime});

    otpSender(otp, email)

    await this.authRepo.save(user)

    return {message: "Please check your email"}
  }

  // login
  async login(dto: LoginAuthDto) {
    const {email, password} = dto as LoginAuthDto;
    const foundedUser = await this.authRepo.findOne({
      where:  {email}
    });

    if(!foundedUser) throw new BadRequestException("user is not exist")
    
    const check = await bcrypt.compare(password, foundedUser.password)

    if(!check) throw new BadRequestException("password is incorrect")

    const otpTime = Date.now()+120000
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await this.authRepo.update({id: foundedUser.id}, {otp, otpTime})

    otpSender(otp, email)

    return {message: `we send code to your email`}
  }

  // verify
  async verify(verifyAuthDto: VerifyAuthDto){
    const {email, otp}= verifyAuthDto as VerifyAuthDto
    const foundedUser = await this.authRepo.findOne({
      where:  {email}
    });

    if(!foundedUser) throw new BadRequestException("user is not exist")

    if(foundedUser.otp==="") throw new BadRequestException("Otp has not been sent, try to login")

    const chekOtp = /^\d{6}$/.test(otp)

    if(!chekOtp) throw new BadRequestException("wrong otp validation")

    if(foundedUser.otp != otp) throw new BadRequestException("wrong otp")

    if(foundedUser.otpTime && Date.now()>foundedUser.otpTime) throw new GatewayTimeoutException("otp time is expired")

    await this.authRepo.update( {id: foundedUser.id}, {otp: "", otpTime: 0})

    const payload = {id: foundedUser.id, email: foundedUser.email, role: foundedUser.role}

    const token = await this.jwtService.signAsync(payload)

    return {message: "you have successfully logged in", token}
  }

  // forgot password
  async forgotPassword(dto: ForgotPasswordAuthDto){
    const {email} = dto as ForgotPasswordAuthDto

    const foundedUser = await this.authRepo.findOne({
      where:  {email}
    })

    if(!foundedUser) throw new BadRequestException("user is not exist")

    const otpTime = Date.now()+120000
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.authRepo.update({id: foundedUser.id}, {otp, otpTime})

    otpSender(otp, email)

    return {message: "we have send you email to change your password"}
  }



  // forgot password verify
  async forgotPasswordVerify(verifyForgotPasswordAuthDto: VerifyForgotPasswordAuthDto){
    const {email, otp, password}= verifyForgotPasswordAuthDto as VerifyForgotPasswordAuthDto
    const foundedUser = await this.authRepo.findOne({
      where:  {email}
    });

    if(!foundedUser) throw new BadRequestException("user is not exist")

    if(foundedUser.otpTime && Date.now()>foundedUser.otpTime) throw new GatewayTimeoutException("otp time is expired")

    if(foundedUser.otp==="") throw new BadRequestException("Otp has not been sent, try to login")

    const chekOtp = /^\d{6}$/.test(otp)

    if(!chekOtp) throw new BadRequestException("wrong otp validation")

    if(foundedUser.otp != otp) throw new BadRequestException("wrong otp")


    const hash = await bcrypt.hash(password, 14)

    await this.authRepo.update({ id: foundedUser.id },{ otp: "", otpTime: 0, password: hash });

    return {message: "your password has been updated"}
  }
}