import { Router } from "express";
import * as productController from "../controllers/product.controller";
import {authenticate } from "../middlewares/auth.middleware";

const ProductRoutes = Router({mergeParams:true})

ProductRoutes.get('/',authenticate, productController.getProducts);


export default ProductRoutes