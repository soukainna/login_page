import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user_entity";
import bcryptjs from 'bcryptjs'
import {sign, verify} from 'jsonwebtoken'

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
    const {password, ...user} = await getRepository(User).save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 12)
    })

    res.send(user);
}


//login part

export const Login = async (req: Request, res: Response) => {
    const user = await getRepository(User).findOne({
        where: {
            email: req.body.email
        }})

    if(!user){
        return res.status(400).send({
            message: "invalid credentials"
        })
    }

    if(!await bcryptjs.compare(req.body.password, user.password)){
        return res.status(400).send({
            message: "invalid credentials"
        })
    }

    const accessToken = sign({
        id: user.id
    }, process.env.ACCESS_SECRET ||  '', {expiresIn: '30s'})

    const refreshToken = sign({
        id: user.id
    }, process.env.REFRESH_SECRET ||  '', {expiresIn: '1w'})

    //stock my tokens in cookies
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //one day
    })

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 day
    })

    res.send({
        message: "success"
    })
}

//auth

export const authUser = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['access_token'];

        const payload: any = verify(cookie, process.env.ACCESS_SECRET || '')

        if (!payload) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await getRepository(User).findOne({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }
         //this is a better way hide my password
        const {password, ...data} = user;

        res.send(data)
        } catch (e){
            return res.status(401).send({
                message: 'Unauthenticated'
            }) 
        }
    
}