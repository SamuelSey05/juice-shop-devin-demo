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
    res = { send: sinon.spy(), status: sinon.stub().returns({ send: sinon.spy() }) }
    next = sinon.spy()
  })

  describe('promotionVideo', () => {
    let readFileStub: sinon.SinonStub
    let readFileSyncStub: sinon.SinonStub

    beforeEach(() => {
      readFileStub = sinon.stub(fs, 'readFile')
      readFileSyncStub = sinon.stub(fs, 'readFileSync')
      readFileSyncStub.returns('WEBVTT\n\n00:00.000 --> 00:00.001\ntest')
    })

    afterEach(() => {
      readFileStub.restore()
      readFileSyncStub.restore()
    })

    it('should not throw an uncaught exception when fs.readFile returns an error', (done) => {
      const testError = new Error('ENOENT: no such file or directory')
      readFileStub.callsFake((_path: string, callback: (err: Error | null, data: Buffer | null) => void) => {
        callback(testError, null)
      })

      const handler = promotionVideo()

      // Before the fix, this would throw an uncaught exception inside the async
      // callback and crash the Node.js process. After the fix, the error is
      // forwarded to Express error-handling middleware via next(err).
      handler(req, res, next)

      setTimeout(() => {
        expect(next).to.have.been.calledWith(testError)
        done()
      }, 50)
    })

    it('should render the promotion video page when the template file is read successfully', (done) => {
      const templateContent = 'p Hello World'
      readFileStub.callsFake((_path: string, callback: (err: Error | null, data: Buffer | null) => void) => {
        callback(null, Buffer.from(templateContent))
      })

      res.send = sinon.spy()

      const handler = promotionVideo()
      handler(req, res, next)

      setTimeout(() => {
        expect(res.send).to.have.been.called // eslint-disable-line @typescript-eslint/no-unused-expressions
        done()
      }, 50)
    })
  })
})
