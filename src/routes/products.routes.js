import {Router} from "express";
// import { ProductManagerFile } from "../daos/managers/productManagerFile.js";
import {ProductManagerMongo} from "../daos/managers/productManagerMongo.js";
//importamos el modelo de productos
import {ProductModel} from "../daos/models/product.model.js";

//services
// const productManager = new ProductManagerFile('products.json');
const productManager = new ProductManagerMongo(ProductModel);

const router = Router();

router.get("/:pid",async(req,res)=>{
    try {
        const {pid} = req.params;
        const product = await productManager.getProductById(pid);
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
        const productdeleted = await productManager.deleteProduct(productId);
        res.json({status:"success", result:productdeleted.message});
    } catch (error) {
        res.status(400).json({message:error});
    }
});

export {router as productsRouter};