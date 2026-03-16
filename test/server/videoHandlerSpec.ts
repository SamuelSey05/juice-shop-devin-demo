/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import fs from 'node:fs'
import { promotionVideo } from '../../routes/videoHandler'

const expect = chai.expect
chai.use(sinonChai)

describe('videoHandler', () => {
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    req = {}
    res = { send: sinon.spy(), status: sinon.stub().returnsThis() }
    next = sinon.spy()
  })

  describe('promotionVideo', () => {
    it('should not throw an uncaught exception when the pug template file cannot be read', (done) => {
      const readFileStub = sinon.stub(fs, 'readFile')
      readFileStub.callsFake((_path: any, callback: any) => {
        callback(new Error('ENOENT: no such file or directory'))
      })

      const handler = promotionVideo()
      // Before the fix, this would throw an uncaught exception in the async callback
      // and crash the server. After the fix, it should call next(err) or send an error response.
      handler(req, res, next)

      // Allow the async callback to execute
      setTimeout(() => {
        expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error))
        readFileStub.restore()
        done()
      }, 50)
    })

    it('should forward the error to the Express error handler via next()', (done) => {
      const readFileStub = sinon.stub(fs, 'readFile')
      const testError = new Error('simulated read failure')
      readFileStub.callsFake((_path: any, callback: any) => {
        callback(testError)
      })

      const handler = promotionVideo()
      handler(req, res, next)

      setTimeout(() => {
        expect(next).to.have.been.calledWith(testError)
        readFileStub.restore()
        done()
      }, 50)
    })
  })
})
