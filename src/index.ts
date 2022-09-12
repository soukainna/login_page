import { log } from "console";
import  express, {Request, Response} from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";



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

    routes(app)
    // app.get("/", (req: Request, res: Response) => {
    //     res.send('hello');
    // })

    app.listen(8000, () => {
        console.log('listening to port 8000')
    })

})

