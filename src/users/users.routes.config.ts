import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import express from 'express'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes(): express.Application {
    this.app
      .route('/users')
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersMiddleware.validateCompanyNameDoesntExist,
        UsersMiddleware.accessTokenCheck,
        UsersController.createUser,
      )

    this.app
      .route('/users/login')
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateEmailRegistered,
        UsersController.loginUser,
      )
    this.app
      .route('/users/resetpassword')
      .post(
        UsersMiddleware.validatePasswordField,
        UsersMiddleware.accessTokenCheck,
        UsersController.resetPassword,
      )

    this.app.param('userId', UsersMiddleware.extractUserId)
    this.app
      .route('/users/:userId')
      .get(UsersMiddleware.validateUserExists, UsersController.getUserById)
      .delete(UsersMiddleware.validateUserExists, UsersController.removeUser)

    return this.app
  }
}
