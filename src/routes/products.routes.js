import {Router} from "express";
// import { ProductsFiles } from "../daos/managers/products.files.js";
import { ProductsMongo } from "../daos/managers/products.mongo.js";
// se importa el modelo de productos
import { ProductsModel } from "../daos/models/product.model.js";

//services
const productsService = new ProductsMongo(ProductsModel);

const router = Router();

router.get("/:pid",async(req,res)=>{
    try {
        const {pid} = req.params;
        const product = await productsService.getProductById(pid);
        // console.log("product: ", product);
        res.status(200).json({status:"success", result:product});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

//ruta para eliminar el producto
router.delete("/:pid",async(req,res)=>{
    try {
        const productId = req.params.pid;
        //luego eliminamos el producto
        const productdeleted = await productsService.deleteProduct(productId);
        res.json({status:"success", result:productdeleted.message});
    } catch (error) {
        res.status(400).json({message:error});
    }
});

export {router as productsRouter};