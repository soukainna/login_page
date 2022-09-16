import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { Any, getRepository } from "typeorm";
import { Reset } from "../entity/reset_entity";
import { User } from "../entity/user_entity";
import bcryptjs from 'bcryptjs'

export const forgotPassword =async (req: Request, res: Response) => {
    const {email} = req.body
    const token = Math.random().toString(20).substring(2, 12)

   await getRepository(Reset).save({
        email,
        token
    })

    //this allow to open the app mailhog to send email
    const transporter = createTransport({
        host: '0.0.0.0',
        //this is the binding port from mailhog
        port: 1025 
    })

    const url = `http://localhost:4200/reset/${token}`;

    //this send email from ... to my email to reset my pass
    await transporter.sendMail({
        from: 'from@example.com',
        to: email,
        subject: 'Reset your password',
        html: `Click <a href="${url}">here</a> to reset your password!`
    })

    res.send({
        message: 'Please check your email!'
    })
} 

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const {token, password, password_confirm} = req.body;

    if(password !== password_confirm){
        return res.status(400).send({
            message: "password's do not match"
        })
    }

    const resetPassword = await getRepository(Reset).findOne({
        where: {token}
    })

    if (!resetPassword) {
        return res.status(400).send({
            message: "invalid Url"
        })
    }

    const user = await getRepository(User).findOne({
        where : {email: resetPassword.email}
    });

    if (!user) {
        return res.status(400).send({
            message: "User not found!"
        })
    }

    await getRepository(User).update(user.id, {
        password: await bcryptjs.hash(password, 12)
    })

    res.send({
        message: "password has been reset "
    })
    }catch{
        
    res.send({
        message: "Error reset "
    })
    }
}
