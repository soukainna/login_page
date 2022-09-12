import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user_entity";
import bcryptjs from 'bcryptjs'

export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    //
    if(body.first_name.length === 0){
        return res.status(400).send({
            message: "first_name is empty"
        })
    }
    //
    if(body.last_name.length === 0){
        return res.status(400).send({
            message: "last_name is empty"
        })
    }

    //
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if ( expression.test(body.email) === false){
        return res.status(400).send({
            message: "email is nor correct"
        })
    }
    //
    // more than 8 chars  
    // at least one number
    // at least one special character
    // const pass: RegExp =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    // if(pass.test(body.password)=== false){
    //     return res.status(400).send({
    //         message: "password's must have at least 8 chars and one number and one special caracter"
    //     })
    // }
    if(body.password !== body.password_confirm){
        return res.status(400).send({
            message: "password's do not match"
        })
    }

    //stock my user
    const user = await getRepository(User).save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 12)
    })

    res.send(user);
}