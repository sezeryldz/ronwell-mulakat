import debug from 'debug'
import { CreateUserDto } from '../dto/create.user.dto'
import { PrismaClient } from '@prisma/client'
const log: debug.IDebugger = debug('app:prisma-service')
const prisma = new PrismaClient()

class PrismaUsersService {
  constructor() {
    log('Created new instance of User')
  }

  async create(user: CreateUserDto) {
    let companyId: number
    if (user.type == 'B2B') {
      const prismaCompany = await prisma.company.create({
        data: {
          name: user.companyName,
        },
      })
      companyId = prismaCompany.id
    } else {
      const company = await this.getCompanyById(user.hostCompany)
      companyId = company.id
    }

    const prismaUser = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.firstName,
        surname: user.lastName,
        phone: user.phone,
        type: user.type,
        companyId: companyId,
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

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
  }

  async getCompanyById(id: number) {
    return await prisma.company.findUnique({
      where: {
        id: id,
      },
    })
  }

  async getCompanyByName(name: string) {
    return await prisma.company.findUnique({
      where: {
        name: name,
      },
    })
  }

  async updatePassword(email: string, password: string) {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    })
  }
}

export default new PrismaUsersService()
