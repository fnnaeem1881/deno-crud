import {
    Application,
    Router,
    Context,
    Status,
} from "https://deno.land/x/oak/mod.ts";

import { getItems,getItemsById,getItemsStore,ItemsUpdate,ItemsDelete } from '../controllers/default.ts'
const router = new Router();

router.get('/items', getItems)
router.get('/items/:id', getItemsById)
router.post('/items', getItemsStore)
router.post('/items/:id', ItemsUpdate)
router.delete('/items/:id', ItemsDelete)
   

export default router
