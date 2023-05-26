import {Router} from "express";
import { ProductsMongo } from "../daos/managers/products.mongo.js";
import { ProductsModel } from "../daos/models/product.model.js";
import { CartsMongo } from "../daos/managers/carts.mongo.js";
import { CartModel } from "../daos/models/cart.model.js";

const router = Router();

const productsService = new ProductsMongo(ProductsModel);
const cartsService = new CartsMongo(CartModel);

router.get("/",(req,res)=>{
    res.render("chat");
});

export {router as viewsRouter}