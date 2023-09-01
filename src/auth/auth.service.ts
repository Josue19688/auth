import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserImage } from './entities/user-image.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { ActivateUserDto } from './dto/activated-user.tdo';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetPassword } from './dto/validate-reset-password.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true, roles: true }
    });

    if (!user) throw new UnauthorizedException('Credenciales invalidas!!');
    if (user.active === false) throw new UnauthorizedException('Usuario inabilitado, comuniquese al departamento de seguirdad. EXT.418, para activarlo.');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales invalidas!!');

    const { password: _, ...rest } = user;

    return {

      user: rest,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus(user: User) {
    return {
      user: user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { password, email, ...userData } = createUserDto;

    const userEmail = await this.userRepository.findOne({
      where: {
        email
      }
    })
    if (userEmail) throw new NotFoundException(`El correo  ${email} ya existe...`);

    try {

      const user = this.userRepository.create({
        ...userData,
        email,
        password: bcrypt.hashSync(password, 10),
        activationToken: uuidv4()
      });

      await this.userRepository.save(user);
      delete user.password;


      return {
        ok: true,
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {

      this.handleExceptions(error);

    }
  }


  async activateUser(activateUserDto: ActivateUserDto) {
    const { id, code } = activateUserDto;
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        activationToken: code,
        active: false
      }
    })

    if (!user) throw new NotFoundException(`User notFound!!`);

    user.active=true;
    await this.userRepository.save(user);
    return 'user activated!!';


  }

  
  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

  async resetPasswordToken(resetPasswordDto:ResetPasswordDto){
    const {email} =resetPasswordDto;

    const user =await this.userRepository.findOne({
      where:{
        email
      }
    })

    if (!user) throw new NotFoundException(`User notFound!!`);

    user.resetPasswordToken=uuidv4();
    this.userRepository.save(user);

    //!Falta crear un modulo de email para enviar correos
    return 'Se envio un mensaje a su correo!!';
  }

  async validatePassword(validateResetPassword:ValidateResetPassword){
    const {resetPasswordToken, password} = validateResetPassword;

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken:resetPasswordToken,
        active: true
      }
    })
  }



  private handleExceptions(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Error al crear el registro en el servidor`);
  }


}
