import prisma from "../prisma/client";
import readline from 'readline';
import fs from 'fs';

export const mockProcessFile = async (taskId: string, fileUrl:string)=>{
console.log(`Starting mock processing for task ${taskId}`)

setTimeout(async()=>{
    try {
        await prisma.product.createMany({
            data:[
                {name:'Product A', price:10000, stock:20},
                {name:'Product B', price:20000, stock:30},
                {name:'Product C', price:30000, stock:40}
            ]
        });
    await prisma.processTask.update({
        where:{id:taskId},
        data:{status:'success'}
    });
    console.log(`Task ${taskId} proccessed successfully!`);
    } catch (error) {
        console.error(`Task ${taskId} failed`, error);
        await prisma.processTask.update({
            where:{id:taskId},
            data:{status:'fail'}
        });
    }
   
})
}

export const processCsvFile = async (filePath: string, taskId: string) => {
    const products: any[] = [];
  
    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
  
      let isHeader = true;
      for await (const line of rl) {
        if (isHeader) {
          isHeader = false;
          continue;
        }
  
        const [name, price, stock] = line.split(';');
  
        products.push({
          name: name.trim(),
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        });
      }
  
      await prisma.product.createMany({ data: products });
  
      await prisma.processTask.update({
        where: { id: taskId },
        data: { status: 'success' },
      });
    } catch (error) {
      console.error('Failed processing:', error);
      await prisma.processTask.update({
        where: { id: taskId },
        data: { status: 'fail' },
      });
    }
  };