import { IsEmail, IsNotEmpty, IsString } from "class-validator";




export class SendEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:string;
}
