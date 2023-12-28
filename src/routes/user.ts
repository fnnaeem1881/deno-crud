import {Application,Router,Context,Status,} from "https://deno.land/x/oak/mod.ts";
import { authorized } from "./..//middlewares/isAuthorized.ts";
import { getUser} from '../controllers/User/UserController.ts'


const UserRoute = new Router();
UserRoute.use(authorized);

UserRoute.get('/user', getUser)

export default UserRoute
