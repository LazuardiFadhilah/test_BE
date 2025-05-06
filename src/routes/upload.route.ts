import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import {authenticate } from "../middlewares/auth.middleware";

const UploadRoutes = Router({mergeParams:true})

UploadRoutes.post('/',authenticate, uploadController.uploadFile)


export default UploadRoutes