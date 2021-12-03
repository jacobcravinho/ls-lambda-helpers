const { Response } = require('./response');

const MESSAGE = {
  string: 'Test message',
  object: {
    string: 'Test message',
    number: 123,
    boolean: true,
  },
};

function stringifyError(message) {
  return stringifyMessage({ error: JSON.stringify(message) });
}

function stringifyMessage(message) {
  return JSON.stringify(message);
}

describe('response instance succeeded', () => {
  it('should return status code, headers and body when succeed', () => {
    const response = new Response(MESSAGE).success();
    expect(response.statusCode).toBeTruthy();
    expect(response.headers).toBeTruthy();
    expect(response.body).toBeTruthy();
  });

  it('should have undefined body when no message is provided', () => {
    const response = new Response().success();
    expect(response.body).toBeUndefined();
  });

  it('should display provided object message in body of success response (stringified)', () => {
    const stringifiedMessage = stringifyMessage(MESSAGE.object);
    const response = new Response(MESSAGE.object).success();
    expect(response.body).toStrictEqual(stringifiedMessage);
  });

  it('should return a 200 status code', () => {
    const response = new Response(MESSAGE.object).success();
    expect(response.statusCode).toStrictEqual(200);
  });

  it('should return a 201 status code when is provided', () => {
    const response = new Response(MESSAGE.object).success({ statusCode: 201 });
    expect(response.statusCode).toStrictEqual(201);
  });

  it('should return a default headers objects', () => {
    const response = new Response(MESSAGE.object).success();
    expect(response.headers['Content-Type']).toStrictEqual('application/json');
    expect(response.headers['Access-Control-Allow-Origin']).toStrictEqual('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toStrictEqual(
      true,
    );
  });
});

describe('response static succeeded', () => {
  it('should display provided object message in body of success response (stringified)', () => {
    const stringifiedMessage = stringifyMessage(MESSAGE.object);
    const response = Response.success(MESSAGE.object);
    expect(response.body).toStrictEqual(stringifiedMessage);
  });
});

describe('response instance failed', () => {
  it('should return status code, headers and body when failed', () => {
    const response = new Response(MESSAGE).fail();
    expect(response.statusCode).toBeTruthy();
    expect(response.headers).toBeTruthy();
    expect(response.body).toBeTruthy();
  });

  it('should have empty object stringified as a body when no message is provided and fails', () => {
    const response = new Response().fail();
    expect(response.body).toBe('{}');
  });

  it('should display provided string message in body of failed response (stringified)', () => {
    const stringifiedMessage = stringifyMessage({ error: MESSAGE.string });
    const response = new Response(MESSAGE.string).fail();
    expect(response.body).toStrictEqual(stringifiedMessage);
  });

  it('should display provided object message in body of failed response (stringified)', () => {
    const stringifiedMessage = stringifyError(MESSAGE.object);
    const response = new Response(MESSAGE.object).fail();
    expect(response.body).toStrictEqual(stringifiedMessage);
  });
});

describe('response static failed', () => {
  it('should display provided string message in body of failed response (stringified)', () => {
    const stringifiedMessage = stringifyMessage({ error: MESSAGE.string });
    const response = Response.fail(MESSAGE.string);
    expect(response.body).toStrictEqual(stringifiedMessage);
  });

  it('should display provided object message in body of failed response (stringified)', () => {
    const stringifiedMessage = stringifyError(MESSAGE.object);
    const response = Response.fail(MESSAGE.object);
    expect(response.body).toStrictEqual(stringifiedMessage);
  });
});
