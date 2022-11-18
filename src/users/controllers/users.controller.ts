// we import express to add types to the request/response objects from our controller functions
import express from 'express'

// we import our newly created user services
import usersService from '../services/users.service'

// we import the argon2 library for password hashing
import argon2 from 'argon2'

// we use debug with a custom context as described in Part 1
import debug from 'debug'

const log: debug.IDebugger = debug('app:users-controller')
class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list()
    res.status(200).send(users)
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(Number(req.body.id))
    res.status(200).send(user)
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password)
    const createdUser = await usersService.create(req.body)
    res.status(201).send(createdUser)
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(Number(req.body.id)))
    res.status(200).send(`User ${req.body.id} removed succesfully`)
  }
}

export default new UsersController()
