import {Router} from "express";
import { ProductsMongo } from "../daos/managers/products.mongo.js";
import { ProductsModel } from "../daos/models/product.model.js";
import { CartsMongo } from "../daos/managers/carts.mongo.js";
import { CartModel } from "../daos/models/cart.model.js";

const router = Router();

const productsService = new ProductsMongo(ProductsModel);
const cartsService = new CartsMongo(CartModel);

/* <a href="/">Inicio</a>
<a href="/login">Login</a>
<a href="/signup">Registro</a>
<a href="/profile">Perfil</a> */

//rutas de las vistas
router.get("/", (req,res)=>{
    res.render("home", {products: products});
});

router.get("/login", (req,res)=>{
    res.render("login");
});

router.get("/signup", (req,res)=>{
    res.render("registro");
});

router.get("/profile", (req,res)=>{
    console.log(req.session.user)
    res.render("perfil",{email:req.session.user.email});
});

router.get("/",(req,res)=>{
    return res.render("chat");
});
router.get("/",(req,res)=>{
    return res.render("cartInfo");
});

router.get("/products",async(req,res)=>{
    try {
        const {limit=3,page=1,sort="asc",category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            return res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        // console.log("limit: ", limit, "page: ", page, "sortValue: ", sortValue, "category: ", category, "stock: ", stock);
        let query = {};
        if(category && stockValue){
            query = {category: category, stock:stockValue}
        } else {
            if(category || stockValue){
                if(category){
                    query={category:category}
                } else {
                    query={stock:stockValue}
                }
            }
        }
        // console.log("query: ", query)
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        console.log("baseUrl", baseUrl);
        //baseUrl: http://localhost:8080/api/products
        const result = await productsService.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
        // console.log("result: ", result);
        const response = {
            status:"success",
            payload:result.docs,
            totalPages:result.totalPages,
            totalDocs:result.totalDocs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.prevPage}` )}` : null,
            nextLink: result.hasNextPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.nextPage}` )}` : null,
        }
        console.log("response: ", response);
        res.render("products",response);
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
    res.render("products");
});

router.get("/products/:pid",async(req,res)=>{
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);
        // console.log("product: ", product);
        res.render("productInfo", product);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
});

router.get("/cart/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        // console.log("cart:", cart)
        res.render("cartInfo",cart);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
});

// //ruta para obtener Cart e informacion de products
// app.get("/cart/:cid", async(req,res)=>{
//     try {
//         const cartId = req.params.cid;
//         //populate("nombre_de_la_propiedad_a_popular")
//         const cart = await CartModel.findById(cartId).populate('products');
//         res.render(cart);
//     } catch (error) {
//         res.send(error.message)
//     }
// });

export {router as viewsRouter}