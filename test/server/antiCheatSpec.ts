/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import chai from 'chai'
import { isSensitiveChallenge } from '../../lib/antiCheat'

const expect = chai.expect

describe('antiCheat', () => {
  describe('isSensitiveChallenge', () => {
    it('should identify password-related challenge keys as sensitive', () => {
      expect(isSensitiveChallenge('changePasswordBenderChallenge')).to.equal(true)
      expect(isSensitiveChallenge('weakPasswordChallenge')).to.equal(true)
      expect(isSensitiveChallenge('dlpPasswordSprayingChallenge')).to.equal(true)
      expect(isSensitiveChallenge('oauthUserPasswordChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordJimChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordBenderChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordBjoernChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordMortyChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordBjoernOwaspChallenge')).to.equal(true)
      expect(isSensitiveChallenge('resetPasswordUvoginChallenge')).to.equal(true)
      expect(isSensitiveChallenge('passwordRepeatChallenge')).to.equal(true)
    })

    it('should identify API key challenge keys as sensitive', () => {
      expect(isSensitiveChallenge('leakedApiKeyChallenge')).to.equal(true)
    })

    it('should not identify non-sensitive challenge keys as sensitive', () => {
      expect(isSensitiveChallenge('scoreBoardChallenge')).to.equal(false)
      expect(isSensitiveChallenge('loginAdminChallenge')).to.equal(false)
      expect(isSensitiveChallenge('errorHandlingChallenge')).to.equal(false)
      expect(isSensitiveChallenge('directoryListingChallenge')).to.equal(false)
    })

    it('should return false for unknown keys', () => {
      expect(isSensitiveChallenge('someUnknownChallenge')).to.equal(false)
    })
  })
})
