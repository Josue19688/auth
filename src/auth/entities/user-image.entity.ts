import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';



@Entity()
export class UserImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
        ()=>User,
        (user)=>user.images,
        {onDelete:'CASCADE'}
    )
    user:User
    
}