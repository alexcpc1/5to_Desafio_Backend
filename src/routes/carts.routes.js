import {Router} from "express";
// import { CartFiles } from "../daos/managers/carts.Files.js";
// import { ProductsFiles } from "../daos/managers/products.files.js";
import { CartsMongo } from "../daos/managers/carts.mongo.js";
import { ProductsMongo } from "../daos/managers/products.mongo.js";
import { CartModel } from "../daos/models/cart.model.js";
import { ProductsModel } from "../daos/models/product.model.js";

//servicio
// const cartsService = new CartFiles("carts.json");
// const productsService = new ProductsFiles('products.json');
const cartsService = new CartsMongo(CartModel);
const productsService = new ProductsMongo(ProductsModel);

const router = Router();

//agregar carrito
router.post("/",async(req,res)=>{
    try {
        const cartAdded = await cartsService.addCart();
        res.json({status:"success", result:cartAdded, message:"cart added"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para listar todos los productos de un carrito
router.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        //obtenemos el carrito
        const cart = await cartsService.getCartById(cartId);
        res.json({status:"success", result:cart});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para agregar un producto al carrito
router.post("/:cid/product/:pid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCartById(cartId);
        // console.log("cart: ", cart);
        const product = await productsService.getProductById(productId);
        // console.log("product: ", product);
        const cartUpdated = await cartsService.addProductToCart(cartId, productId);
        res.json({status:"success", result:cartUpdated, message:"product added"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCartById(cartId);
        // console.log("cart: ", cart);
        const product = await productsService.getProductById(productId);
        // // console.log("product: ", product);
        const response = await cartsService.deleteProduct(cartId, productId);
        res.json({status:"success", result:response, message:"product deleted"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para actualizar todos los productos de un carrito.
router.put("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartsService.getCartById(cartId);
        cart.products = [...products];
        const response = await cartsService.updateCart(cartId, cart);
        res.json({status:"success", result:response, message:"cart updated"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

export {router as cartsRouter};