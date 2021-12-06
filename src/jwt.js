/**
 * Decode JSON Web Token _(JWT)_.
 *
 * @param {string} token JSON Web Token _(JWT)_ to be decoded.
 * @returns {string} Decoded JSON Web Token _(JWT)_.
 */
const decode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = new Buffer.from(base64, 'base64');
    const payloadInit = buffer.toString('ascii');
    const decodedToken = JSON.parse(payloadInit);

    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid JWT token: '${error.message}'`);
  }
};

/**
 * Check if decoded JSON Web Token _(JWT)_ has expired.
 *
 * @param {string} decodedToken Decoded JSON Web Token _(JWT)_ to be checked.
 * @returns {boolean} True if decoded JSON Web Token _(JWT)_ has expired, false otherwise.
 */
const decodedTokenHasExpired = (decodedToken) => {
  const { exp } = decodedToken;

  if (!exp)
    throw new Error(
      'Decoded JWT token does not have an expiration date (exp field)',
    );

  const expirationDate = new Date(exp * 1000);

  return new Date() > expirationDate;
};

/**
 * Check if JSON Web Token _(JWT)_ is valid.
 *
 * @param {string} token JSON Web Token _(JWT)_ to be checked.
 * @returns {boolean} True if JSON Web Token _(JWT)_ is valid, false otherwise.
 */
const hasExpired = (token) => decodedTokenHasExpired(decode(token));

module.exports = {
  decode,
  decodedTokenHasExpired,
  hasExpired,
};
