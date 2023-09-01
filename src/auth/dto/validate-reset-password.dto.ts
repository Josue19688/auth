import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";




export class ValidateResetPassword{

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    resetPasswordToken:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número.'
    })
    password:string;
}