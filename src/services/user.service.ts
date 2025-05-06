import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const userById = async (id: string) =>{
    return await prisma.user.findUnique({where: {id}});
}

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({ where: { id } });
};

export const updateUser = async (id: string, data:Prisma.UserUpdateInput) =>{
    return await prisma.user.update({
        where: { id },
        data,
    })
}
