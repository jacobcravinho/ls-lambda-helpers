const { decode, decodedTokenHasExpired, hasExpired } = require('./jwt');

// Was used jwt.io to generate tokens
describe('jwt', () => {
  let encodedToken;
  let decodedToken;

  beforeEach(() => {
    decodedToken = {
      sub: '1234567890',
      name: 'John Doe',
      exp: 1516239022, // `date` 2018-01-18T01:30:22.000Z
    };

    encodedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  });
  describe('jwt decode', () => {
    it('should decode an encoded token', () => {
      const decoded = decode(encodedToken);
      expect(decoded).toStrictEqual(decodedToken);
    });

    it('should throw an error if token is not valid', () => {
      expect(() => decode('invalid')).toThrowError(/Invalid JWT/);
    });
  });

  describe('jwt decodedTokenHasExpired', () => {
    it('should return true if decoded token has expired', () => {
      const isExpired = decodedTokenHasExpired(decodedToken);
      expect(isExpired).toBe(true);
    });

    it('should return false if decoded token has not expired', () => {
      // Decoded JWT token expires in many years (2121-11-12)
      decodedToken.exp = new Date().getTime() / 1000 + 100 * 365 * 24 * 60 * 60;

      const isExpired = decodedTokenHasExpired(decodedToken);
      expect(isExpired).toBe(false);
    });

    it('should throw an error when no expiration date is provided in decoded token', () => {
      expect(() => decodedTokenHasExpired({})).toThrowError(/expiration date/);
    });
  });

  describe('jwt hasExpired', () => {
    it('should return true if token has expired', () => {
      const isExpired = hasExpired(encodedToken);
      expect(isExpired).toBe(true);
    });

    it('should return false if token has not expired', () => {
      // JWT Token expires in many years (2263-04-27)
      const isExpired = hasExpired(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjo5MjU2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      );

      expect(isExpired).toBe(false);
    });

    it('should throw an error when no expiration date is provided in encoded token', () => {
      // { "sub": "1234567890", "name": "John Doe" }
      expect(() =>
        hasExpired(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A',
        ),
      ).toThrowError(/expiration date/);
    });
  });
});
