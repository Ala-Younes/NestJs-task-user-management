import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async signUp(params: {
    authCredentialsDto: AuthCredentialsDto;
  }): Promise<User> {
    const { authCredentialsDto } = params;

    const salt = await bcrypt.genSalt();
    // ! Each time we sign up a different hash is generated event if we use the same password ....
    const hashedPassword = await this.hashPassword(
      authCredentialsDto.password,
      salt,
    );

    try {
      return await this.prisma.user.create({
        data: {
          salt: salt,
          password: hashedPassword,
          username: authCredentialsDto.username,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException('Internal server error');
        }
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    // Find user by username
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // Validate password
    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      // Password is incorrect
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return the user
    return user.username;
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
