import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class UsersService implements CRUD {
  constructor() {
    log('Created new instance of User')
  }

  async create(user: CreateUserDto) {
    const prismaCompany = await prisma.company.create({
      data: {
        company: user.companyName,
      },
    })

    const prismaUser = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.firstName,
        surname: user.lastName,
        type: 'B2B',
        companyId: prismaCompany.id,
      },
    })

    return {
      company: user.companyName,
      user: prismaUser,
    }
  }

  async deleteById(userId: number) {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return deleteUser
  }

  async list() {
    return await prisma.user.findMany()
  }

  async readById(userId: number) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }
}

export default new UsersService()
