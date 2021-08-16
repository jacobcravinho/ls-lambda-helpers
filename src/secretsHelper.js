const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({region: 'us-west-2'});

const getSecret = async secretName => {
    try {
        const res = await client.getSecretValue({ SecretId: secretName }).promise();
        return JSON.parse(res.SecretString);
    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}

const putSecret = async (secretName, secretValue) => {
    try {
      const res = await client.putSecretValue({ SecretId: secretName, SecretString: secretValue}).promise();
      return res
    } catch (err) {
      console.error(err);
      return 'ERROR';
    }
  }

module.exports = {getSecret, putSecret};