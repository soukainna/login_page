import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    constructor(){
        this.avatar = "";
    }
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({default: "none"})
    avatar: string

    @Column()
    first_name!: string

    @Column()
    last_name!: string

    @Column({
        unique: true
    })
    email!: string

    @Column()
    password!: string
}