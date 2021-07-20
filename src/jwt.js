const decode = (token) => {
  const base64Url = token.split('.')[1];

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  const buffer = new Buffer.from(base64, 'base64');

  const payloadInit = buffer.toString('ascii');

  const decodedToken = JSON.parse(payloadInit);

  return decodedToken;
}

const decodedTokenHasExpired = (decodedToken) => {
  const { exp } = decodedToken;

  const expirationDate = new Date(exp * 1000);

  return new Date() > expirationDate;
}

const hasExpired = (token) => decodedTokenHasExpired(decode(token));

module.exports = {
  decode,
  decodedTokenHasExpired,
  hasExpired
};