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
    res = { send: sinon.spy(), set: sinon.spy(), writeHead: sinon.spy() }
    req = { headers: {} }
    next = sinon.spy()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('promotionVideo', () => {
    it('should call next(err) instead of throwing when fs.readFile fails', (done) => {
      const readFileError = new Error('ENOENT: no such file or directory')
      sinon.stub(fs, 'readFile').callsFake((_path: any, callback: any) => {
        callback(readFileError)
      })

      const handler = promotionVideo()
      handler(req, res, next)

      setTimeout(() => {
        expect(next).to.have.been.calledWith(readFileError)
        expect(res.send).to.have.not.been.calledWith(sinon.match.any)
        done()
      }, 10)
    })
  })
})
