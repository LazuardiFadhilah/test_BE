import { Request, Response } from "express";
import prisma from "../prisma/client";
import * as fs from "fs";
import * as path from "path";
import {processCsvFile} from '../services/process.service'

// export const uploadFile = async (req: Request, res: Response) => {
//   try {
//     const { fileUrl } = req.body;
//     const task = await prisma.processTask.create({
//       data: {
//         fileUrl,
//         status: "Pending",
//       },
//     });

//     console.log(task);

//     mockProcessFile(task.id, fileUrl);
//     return successResponse(res, task, "UPLOAD_SUCCESS");
//   } catch (error: any) {
//     return errorResponse(res, error.message);
//   }
// };

export const uploadFile = async (req: Request, res: Response) => {
    try {
      const { fileBase64 } = req.body;

      if (!fileBase64) {
        return res.status(400).json({ message: "fileBase64 is required" });
      }

      const buffer = Buffer.from(fileBase64, "base64");

      const newFileName = `${Date.now()}.csv`;

      const uploadsDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, newFileName);

      fs.writeFileSync(filePath, new Uint8Array(buffer));

      console.log("Creating processTask with:", {
        fileUrl: `/uploads/${newFileName}`,
        status: "pending",
      });

      const newTask = await prisma.processTask.create({
        data: {
          fileUrl: `/uploads/${newFileName}`,
          status: "pending",
        },
      });
      setTimeout(() => processCsvFile(filePath, newTask.id), 1000);
      return res.status(201).json({
        status: true,
        message: "FILE_UPLOAD_SUCCESSFULLY",
        data: newTask,
      });
    } catch (error: any) {
      console.error("Upload File Error:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  };

