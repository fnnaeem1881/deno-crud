import {Application,Router,Context,Status,} from "https://deno.land/x/oak/mod.ts";
import { authorized } from "./..//middlewares/isAuthorized.ts";


import { getTrips,getTripsById,TripsStore,TripsUpdate,TripsDelete }from '../controllers/Trips/TripsController.ts'
// const router = new Router({ prefix: '/api', namespace: '/v1' });
const trips = new Router();
trips.use(authorized);
trips.get('/trips', getTrips)
// router.get('/Trips/:id', getTripsById)
trips.post('/Trips', TripsStore)
// router.post('/Trips/:id', TripsUpdate)
// router.delete('/Trips/:id', TripsDelete)
   

export default trips
