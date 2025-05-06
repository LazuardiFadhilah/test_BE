import { Request, Response } from "express";
import prisma from "../prisma/client";


export const getProducts = async (req:Request, res:Response)=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const {name, minPrice, maxPrice} = req.query;

        const filters:any = {};

        if(name) {
            filters.name = {contains:name as string};
        }
        if(minPrice||maxPrice){
            filters.price = {};
            if(minPrice) filters.price.gte = parseFloat(minPrice as string);
            if(maxPrice) filters.price.lte = parseFloat(maxPrice as string);
        }
        const total = await prisma.product.count({where:filters});
        const products = await prisma.product.findMany({
            where:filters,
            skip,
            take:limit,
            orderBy:{createdAt:"desc"},
        })

        return res.status(200).json({
            status:true,
            message:"SUCCESS_GET_PRODUCT",
            page,
            limit,
            total,
            totalPages: Math.ceil(total/limit),
            data:products,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
      }
}


  