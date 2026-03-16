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
    res = { send: sinon.spy(), status: sinon.stub().returns({ send: sinon.spy() }) }
    req = {}
    next = sinon.spy()
  })

  describe('promotionVideo', () => {
    it('should not throw an uncaught exception when the pug template file is missing', (done) => {
      // Stub fs.readFile to simulate a file-not-found error
      const readFileStub = sinon.stub(fs, 'readFile')
      const fakeError = new Error('ENOENT: no such file or directory')

      readFileStub.callsFake((_path: any, callback: any) => {
        callback(fakeError)
      })

      const handler = promotionVideo()

      // This should NOT throw an uncaught exception; it should call next(err) instead
      handler(req, res, next)

      // Allow the async callback to execute
      setTimeout(() => {
        expect(next).to.have.been.calledWith(fakeError)
        readFileStub.restore()
        done()
      }, 50)
    })

    it('should render the promotion video page when template file exists', (done) => {
      const readFileStub = sinon.stub(fs, 'readFile')
      const readFileSyncStub = sinon.stub(fs, 'readFileSync')
      const fakeTemplate = Buffer.from('p Hello World')

      readFileStub.callsFake((_path: any, callback: any) => {
        callback(null, fakeTemplate)
      })
      readFileSyncStub.returns('WEBVTT\n\n00:00.000 --> 00:00.001\nTest' as any)

      res = {
        send: sinon.spy(),
        status: sinon.stub().returnsThis()
      }

      const handler = promotionVideo()
      handler(req, res, next)

      setTimeout(() => {
        expect(res.send).to.have.been.calledWith(sinon.match.string)
        expect(next).to.have.not.been.calledWith(sinon.match.any)
        readFileStub.restore()
        readFileSyncStub.restore()
        done()
      }, 50)
    })
  })
})
