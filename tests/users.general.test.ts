import request from 'supertest'
import { faker } from '@faker-js/faker'

import app from '../src/app'

describe('Creates 3 users, lists all then lists one and deletes that one.', function () {
  let cachedUser
  for (let i = 0; i < 3; i++) {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      companyName: faker.company.name(),
    }
    it('register a B2B user', function (done) {
      request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          if (i == 1) {
            cachedUser = res.body.user.id
          }
          return done()
        })
    })
  }

  it('List all of the users', function (done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        return done()
      })
  })

  it('Get one user', function (done) {
    request(app)
      .get('/users/' + cachedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        return done()
      })
  })

  it('Remove one user', function (done) {
    request(app)
      .delete('/users/' + cachedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }

        return done()
      })
  })
})

const b2bUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  companyName: faker.company.name(),
}

const b2cUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
}

describe('Creates a B2B user then logins to get access token, resets the password, then creates a b2c account that is connected to him.', () => {
  let accessToken = null
  it('Register the user', function (done) {
    request(app)
      .post('/users')
      .send(b2bUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        return done()
      })
  })

  it('Login the user', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: b2bUser.email,
        password: b2bUser.password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        accessToken = res.body.accessToken
        return done()
      })
  })

  it('Reset the password of the user', (done) => {
    request(app)
      .post('/users/resetpassword')
      .send({
        password: faker.internet.password(),
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        return done()
      })
  })

  it('Create a B2C account that is connected to the user', (done) => {
    request(app)
      .post('/users')
      .send(b2cUser)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
})
