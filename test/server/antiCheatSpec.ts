/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import logger from '../../lib/logger'
import { calculateCheatScore, SENSITIVE_CHALLENGE_KEYS } from '../../lib/antiCheat'
import { type Challenge } from '../../data/types'

chai.use(sinonChai)
const expect = chai.expect

describe('antiCheat', () => {
  let loggerInfoStub: sinon.SinonStub

  beforeEach(() => {
    loggerInfoStub = sinon.stub(logger, 'info')
  })

  afterEach(() => {
    loggerInfoStub.restore()
  })

  describe('sensitive data logging', () => {
    it('should not log sensitive challenge keys in clear text', () => {
      for (const sensitiveKey of SENSITIVE_CHALLENGE_KEYS) {
        const challenge = {
          key: sensitiveKey,
          name: 'Test Challenge',
          category: 'test',
          description: 'Contains sensitive password: s3cr3t!',
          difficulty: 3,
          solved: false,
          tutorialOrder: null
        } as unknown as Challenge

        calculateCheatScore(challenge)

        const logCall = loggerInfoStub.lastCall
        const logMessage = logCall.args[0] as string

        expect(logMessage).to.not.include(sensitiveKey,
          `Sensitive challenge key "${sensitiveKey}" should not appear in clear text in logs`)
      }
    })

    it('should still log non-sensitive challenge keys normally', () => {
      const challenge = {
        key: 'scoreBoardChallenge',
        name: 'Score Board',
        category: 'test',
        description: 'Find the score board',
        difficulty: 1,
        solved: false,
        tutorialOrder: 1
      } as unknown as Challenge

      calculateCheatScore(challenge)

      const logCall = loggerInfoStub.lastCall
      const logMessage = logCall.args[0] as string

      expect(logMessage).to.include('scoreBoardChallenge')
    })

    it('should use [REDACTED] placeholder for sensitive challenge keys', () => {
      const challenge = {
        key: 'weakPasswordChallenge',
        name: 'Weak Password',
        category: 'test',
        description: 'Login with password: admin123',
        difficulty: 2,
        solved: false,
        tutorialOrder: null
      } as unknown as Challenge

      calculateCheatScore(challenge)

      const logCall = loggerInfoStub.lastCall
      const logMessage = logCall.args[0] as string

      expect(logMessage).to.include('[REDACTED]')
    })
  })
})
