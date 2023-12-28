import {Application,Router,Context,Status,} from "https://deno.land/x/oak/mod.ts";
import { authorized } from "./..//middlewares/isAuthorized.ts";
import { getBidById,BidStore }from '../controllers/Trips/BidController.ts'

const bid = new Router();
bid.use(authorized);
bid.get('/bid/:id', getBidById);
bid.post('/bid',BidStore);

export default bid