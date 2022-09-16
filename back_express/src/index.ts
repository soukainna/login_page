//I should config my dotenv to use the .env
require(('dotenv')).config()

import { log } from "console";
import  express, {Request, Response} from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import cors from 'cors'
import cookieParser from "cookie-parser";


createConnection({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "node_auth",
    "entities": [
        "src/entity/*.ts"
    ],
    "logging": false,
    "synchronize": true
}).then(() => {
    console.log('connection to database')
    const app = express();

    app.use(express.json());

    //allow to use cookie_parser
    app.use(cookieParser())

    //that allow to send request from the backend and credential to manip cookies
    //this is usefull for frontend
    app.use(cors({
        origin:['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
        credentials: true
    }))

    routes(app)
    // app.get("/", (req: Request, res: Response) => {
    //     res.send('hello');
    // })

    app.listen(8000, () => {
        console.log('listening to port 8000')
    })

})

