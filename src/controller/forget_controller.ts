import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { getRepository } from "typeorm";
import { Reset } from "../entity/reset_entity";

export const forgot =async (req: Request, res: Response) => {
    const {email} = req.body
    const token = Math.random().toString(20).substring(2, 12)

    const reset = await getRepository(Reset).save({
        email,
        token
    })

    //this allow to open the app mailhog to send email
    const transporter = createTransport({
        host: '0.0.0.0',
        port: 8025
    })

    const url = 'http://localhost:4200/reset/${token}';

    //this send email from ... to my email to reset my pass
    await transporter.sendMail({
        from: 'from@example.com',
        to: email,
        subject: 'Reset your password',
        html: `Click <a href="{$url}">here</a> to reset your password!`
    })
    
    res.send({
        message: 'Please check your email!'
    })
} 
