import { Request, Response } from "express";
import { getRepository, MoreThanOrEqual } from "typeorm";
import { User } from "../entity/user_entity";
import bcryptjs from 'bcryptjs'
import {sign, verify} from 'jsonwebtoken'
import { Token } from "../entity/token_entity";


export const Register = async ( req: Request, res: Response) => {
    const body = req.body;
    
    
    // if(!body.avatar){
    //     return res.status(400).send({
    //         message: "Error avatar"
    //     })
    // }

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
    const pass: RegExp =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if(pass.test(body.password)=== false){
        return res.status(400).send({
            message: "password's must have at least 8 chars and one number and one special caracter"
        })
    }
    if(body.password !== body.password_confirm){
        return res.status(400).send({
            message: "password's do not match"
        })
    }

    //stock my user
    const {password,tfa_secret, ...user} = await getRepository(User).save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 12),
        avatar: body.avatar.substr(12)
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

    const refreshToken = sign({
        id: user.id
    }, process.env.REFRESH_SECRET ||  '', {expiresIn: '1w'})

    //stock my tokens in cookies
    // res.cookie('access_token', accessToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000 //one day
    // })

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 day
    })

    const expired_at = new Date()
    expired_at.setDate(expired_at.getDate() + 7)

    await getRepository(Token).save({
        user_id: user.id,
        token: refreshToken,
        expired_at
    })

    const token = sign({
        id: user.id
    }, process.env.ACCESS_SECRET ||  '', {expiresIn: '30s'})


    res.send({
        token
    })
}

//auth

export const authUser = async (req: Request, res: Response) => {
    try {
        const accessToken = req.header('Authorization')?.split(' ')[1] || '';

        const payload: any = verify(accessToken, process.env.ACCESS_SECRET || '')

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
        const {password,tfa_secret, ...data} = user;

        res.send(data)
        } catch (e){
            return res.status(401).send({
                message: 'Unauthenticated'
            }) 
        }
    
}

//refresh token that allow to refresh token steal 30s to print info of router /user

export const refresh = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies["refresh_token"];

    const payload: any = verify(cookie, process.env.REFRESH_SECRET || '')

    if (!payload){
        res.status(401).send({
            message : "anauthenticated"
        })
    }

    const refreshToken = await getRepository(Token).findOne({
        where: {
            user_id: payload.id,
            expired_at: MoreThanOrEqual(new Date())
        }
    })

    if (!refreshToken){
        res.status(401).send({
            message : "anauthenticated"
        })}

    //create other token
    const token = sign({
        id: payload.id
    }, process.env.ACCESS_SECRET ||  '', {expiresIn: '30s'})
    //stock my token in a cookie
    // res.cookie('access_token', accessToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000 //one day
    // })

    res.send({
        token
    })

    }catch{
        res.status(401).send({
            message : "anauthenticated"
        })
    }
}

//logout

export const logout = async (req: Request, res: Response) => {
    

    await getRepository(Token).delete({
        token:  req.cookies['refresh_token']
    })
    // res.cookie("access_token", '', {maxAge:0});
    res.cookie("refresh_token", '', {maxAge:0})

    res.send({
        message: "cookies successfuly deleted"
    })
}