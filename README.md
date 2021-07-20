# ls-lambda-helpers
![GitHub package.json version](https://img.shields.io/github/package-json/v/jacobcravinho/ls-lambda-helpers)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jacobcravinho/ls-lambda-helpers?color=green)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/jacobcravinho/ls-lambda-helpers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jacobcravinho/ls-lambda-helpers/npm-publish)

Helpers used to aid in rapid developement and coding consistentcy.
## Install
    npm install ls-lambda-helpers

## Setup
Standard helpers take a argument such as an apiKey when calling a method.  This helper differs in that it uses specified named Environmental Variables.  This makes it a little less flexible but much more powerful in that it requires you to use AWS Secrets Manager.

* Make sure you are storing secrerts in AWS Secrets Manager
* Use a config file to change secrets between environments

## Helpers

<!-- Logger -->
<details><summary><b>Logger</b></summary>
<p>

### Description
Create log levels between environments

* console.debug() - If log level is set to debug, it will log everything.
* console.info() - If log level is set to info, it will log info and error.
* console.error() - If log level is set to error, it will only log error.
* console.audit() - If log level is set to audit, it will log no matter the level or stage.
* console.log() is overwritten so that if the stage is Production it will NOT log. This prevents sensitive information from ending up in the logs
### Setup
#### serverless.yml
```yaml
service: service-name
custom:
    logLevel:
        dev: 'debug'
        qa: 'info'
        preprod: 'info'
        prod: 'error'
provider:
    environment:
        STAGE: ${self:provider.stage}
        LOG_LEVEL: ${self:custom.logLevel.${self:provider.stage}}
```
** Note: If you do not need custom level for each stage and only want to override PROD then only include `STAGE: ${self:provider.stage}`

#### file.js
```js
const { Logger } = require('ls-lambda-helpers');
const console = new Logger();

exports.handler = async (event, context) => { 
  console.info("Event", event);
  console.audit("Context", context);
}
```

</p>
</details>


<!-- AWS Get Secret -->
<details><summary><b>Response</b></summary>
<p>

### Description
When using Lambda Proxy with ApiGateway this will return the proper response back to the client.

### Setup

#### file.js
```js
const { Response } = require('ls-lambda-helpers');

exports.handler = async (event, context) => { 
  const {queryStringParameters:{test}} = event;
  if (test != "string") return new Response("Your input is garbage").fail();
  
  return new Response("Looks Good").sucess();
}
```
</p>
</details>


<!-- AWS Get Secret -->
<details><summary><b>AWS Get Secret</b></summary>
<p>

### Description
Retrieves AWS Secret by name.  Secret must be in json (key: value) format.

### Setup
Create a new secret in Secrets Manager and record the name.
#### file.js
```js
const { Secrets } = require('ls-lambda-helpers');
const {SECRET_NAME} = process.env;

exports.handler = async (event, context) => { 
  const secret = await Secrets.getSecret(SECRET_NAME);
  console.log('SECRET:', secret)
}
```
</p>
</details>


<!-- DDQ Auth -->
<details><summary><b>DDQ Auth</b></summary>
<p>

### Description
Handles authentication and updating expired tokens in AWS SSM parameter store.

### Setup
As of now you must use SSM Parameter Store but a refactor will be coming to move to Secrets Manager
#### serverless.yml
```yaml
service: service-name
provider:
    environment:
        DDQ_URL: https://url-to-ddq-endpoint
        DDQ_TOKEN: /ddq/dev/token
        DDQ_CREDENTIALS: /ddq/dev/credentials
        DDQ_SESSION_TOKEN: /application-name/dev/ddq/session
```

#### file.js
```js
const { DDQ } = require('ls-lambda-helpers');
...
exports.handler = async (event, context) => { 
  const session = await DDQ.ddqAuth();
  const orderHeader = await getOrderHeader(session.ddqToken, orderId);
}
```
</p>
</details>

<!-- SFMC Data Endpoints -->
<details><summary><b>SFMC Data Extensions</b></summary>
<p>

### Description
Handles authentication and calling SalesForce Marketing Cloud DataExtension API

### Setup
You must use AWS SecretesManager to store your credentials.  Please store creds in the following format: `clientId:{ID}, clientSecret:{SECRET}`
#### serverless.yml
```yaml
service: service-name
provider:
    environment:
        SFMC_SECRET_NAME: name-of-secret
```

#### file.js
```js
const { SFMC } = require('ls-lambda-helpers');
// This is the URL path after /data/v1/async/dataextensions/key:
const {SFMC_URL_METHOD} = process.env;

exports.handler = async (event, context) => { 
  const postRes = await SFMC.postAPI(SFMC_URL_METHOD, {items:[{item1:'value1', item2:'value2'}]});
        console.log('POST RES:', postRes);
}
```
</p>
</details>

<!-- JWT -->
<details><summary><b>JWT</b></summary>
<p>

### Description
Handles JWT tokens decoding and validations.

### Setup
The JWT helper has inbuilt functions that take a JWT token to manage their data.
#### file.js
```js
const { JWT } = require('ls-lambda-helpers');

exports.handler = async (event, context) => { 
  const token = JSON.parse(event.body);
  
  // DECODE: Decodes the info inside a token.
  const decodedToken = JWT.decode(token);

  // HAS EXPIRED: Tells if a token has expired.
  const isExpired = JWT.hasExpired(token);
  // You can pass the decoded token to this method if you already did it before.
  const isExpiredFromString = JWT.decodedTokenHasExpired(decodedToken);
}
```
</p>
</details>