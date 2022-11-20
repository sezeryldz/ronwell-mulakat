import express from 'express'
import userService from '../services/prisma.users.service'

// jsonwebtoken library is for generating jwt tokens
import jwt from 'jsonwebtoken'

interface JWTI {
  exp: string
  data: {
    email: string
    type: string
    company: number
  }
}

class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.email && req.body.password) {
      next()
    } else {
      res.status(400).send({
        error: 'Missing required fields email and password',
      })
    }
  }

  async validatePasswordField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.password) {
      next()
    } else {
      res.status(400).send({
        error: 'Missing required field password',
      })
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await userService.getUserByEmail(req.body.email)
    if (user) {
      res.status(400).send({ error: 'User email already exists' })
    } else {
      next()
    }
  }

  async validateCompanyNameDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body.companyName) {
      const company = await userService.getCompanyByName(req.body.companyName)

      if (company) {
        res.status(400).send({ error: 'Company with this name already exists' })
      } else {
        next()
      }
    } else {
      next()
    }
  }

  async validateEmailRegistered(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await userService.getUserByEmail(req.body.email)
    if (user) {
      next()
    } else {
      res.status(400).send({ error: 'User email is not registered' })
    }
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await userService.getUserByEmail(req.body.email)
    if (user.id === Number(req.params.userId)) {
      next()
    } else {
      res.status(400).send({ error: 'Invalid email' })
    }
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await userService.getUserById(Number(req.params.userId))
    if (user) {
      next()
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      })
    }
  }

  async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
    req.body.id = req.params.userId
    next()
  }

  async accessTokenCheck(req: express.Request, res: express.Response, next: express.NextFunction) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
          res.status(401).send({
            message: 'Token Expired',
          })
        } else {
          // Casting host token type and company name
          req.body.hostType = (<JWTI>(<unknown>decoded)).data.type
          req.body.hostCompany = (<JWTI>(<unknown>decoded)).data.company
          req.body.hostEmail = (<JWTI>(<unknown>decoded)).data.email
          // Type of account to be created
          req.body.type = 'B2C'
          next()
        }
      })
    } else {
      // Type of account to be created
      req.body.type = 'B2B'
      next()
    }
  }
}

export default new UsersMiddleware()
