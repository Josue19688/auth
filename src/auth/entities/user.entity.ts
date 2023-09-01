import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserImage } from "./user-image.entity";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName?: string;

    @Column('text', {
        unique: true
    })
    email?: string;

    @Column('text', {
        select: false
    })
    password?: string;

    @Column({ type: 'boolean', default: false })
    active?: boolean;

    @Column({ type: 'uuid', unique: true, name: 'activation_token' })
    activationToken: string;


    @Column({ type: 'uuid', unique: true, name: 'reset_password_token', nullable: true })
    resetPasswordToken: string;

    @Column('text', {
        default: 'user'
    })
    roles?: string;

    @CreateDateColumn()
    createdAt: Date;

    //TODO:RELACIONES CON IMAGES DE USUARIOS

    @ApiProperty({
        example: "http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description: 'Retornara una o un arreglo de images'
    })
    @OneToMany(
        () => UserImage,
        (userImage) => userImage.user,
        { cascade: true, eager: true }
    )
    images?: UserImage;




    @BeforeInsert()
    checkFieldBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
    }

}
