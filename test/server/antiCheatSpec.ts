/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import chai from 'chai'
import { sanitizeKeyForLog } from '../../lib/antiCheat'

const expect = chai.expect

describe('antiCheat', () => {
  describe('sanitizeKeyForLog', () => {
    it('should mask sensitive password-related challenge keys', () => {
      expect(sanitizeKeyForLog('changePasswordBenderChallenge')).to.equal('cha***')
      expect(sanitizeKeyForLog('weakPasswordChallenge')).to.equal('wea***')
      expect(sanitizeKeyForLog('dlpPasswordSprayingChallenge')).to.equal('dlp***')
      expect(sanitizeKeyForLog('oauthUserPasswordChallenge')).to.equal('oau***')
      expect(sanitizeKeyForLog('resetPasswordJimChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('resetPasswordBenderChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('resetPasswordBjoernChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('resetPasswordMortyChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('resetPasswordBjoernOwaspChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('resetPasswordUvoginChallenge')).to.equal('res***')
      expect(sanitizeKeyForLog('passwordRepeatChallenge')).to.equal('pas***')
    })

    it('should mask sensitive API key challenge keys', () => {
      expect(sanitizeKeyForLog('leakedApiKeyChallenge')).to.equal('lea***')
    })

    it('should not mask non-sensitive challenge keys', () => {
      expect(sanitizeKeyForLog('scoreBoardChallenge')).to.equal('scoreBoardChallenge')
      expect(sanitizeKeyForLog('loginAdminChallenge')).to.equal('loginAdminChallenge')
      expect(sanitizeKeyForLog('errorHandlingChallenge')).to.equal('errorHandlingChallenge')
      expect(sanitizeKeyForLog('directoryListingChallenge')).to.equal('directoryListingChallenge')
    })

    it('should return the original key for unknown keys', () => {
      expect(sanitizeKeyForLog('someUnknownChallenge')).to.equal('someUnknownChallenge')
    })
  })
})
