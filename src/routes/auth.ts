import {
    Application,
    Router,
    Context,
    Status,
} from "https://deno.land/x/oak/mod.ts";

import { Login,Registration} from '../controllers/Auth/AuthController.ts'
const authRoutes = new Router();

authRoutes.post('/login', Login)
authRoutes.post('/registration', Registration)
   

export default authRoutes
