/**
 * @typedef {Object} Options
 * @property {number} [statusCode] HTTP status code
 * @property {Headers} [headers] HTTP headers
 */

/**
 * @typedef {Object} StructuredResponse
 * @property {number} statusCode HTTP status code
 * @property {Headers} headers HTTP headers
 * @property {string} body HTTP body
 */

/**
 * @typedef {Object.<string, string | number | boolean>} Headers
 */

/**
 * @typedef {unknown} Message
 */

/**
 * Response lambdas in a structured format with status code, headers and body
 */
class Response {
  /** @type {Headers} */
  #headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
  };

  /**
   * Create a new instance of some response with the given message
   *
   * @param {Message} message Message to be displayed in the response
   */
  constructor(message) {
    this.message = message;
  }

  /**
   * Represents a succeeded response with a given message
   *
   * @param {Message} message Message to be displayed in the response
   * @param {Options} [options] Options to be used in the response
   * @returns {StructuredResponse} Response object
   */
  static success(message, options = {}) {
    return new Response(message).success(options);
  }

  /**
   * Represents a failed response with a given message
   *
   * @param {Message} message Message to be displayed in the response
   * @param {Options} [options] Options to be used in the response
   * @returns {StructuredResponse} Response object
   */
  static fail(message, options = {}) {
    return new Response(message).fail(options);
  }

  /**
   * Represents a succeeded response with the stored message
   *
   * @param {Options} [options] Options to be used in the response
   * @returns {StructuredResponse} Response object
   */
  success(options = {}) {
    const { headers = {}, statusCode = 200 } = options;
    try {
      return {
        statusCode,
        headers: { ...this.#headers, ...headers },
        body: JSON.stringify(this.message),
      };
    } catch (error) {
      this.message = error;
      this.fail();
    }
  }

  /**
   * Represents a failed response with the stored message
   *
   * @param {Options} [options] Options to be used in the response
   * @returns {StructuredResponse} Response object
   */
  fail(options = {}) {
    const { headers = {}, statusCode = 400 } = options;
    return {
      statusCode,
      headers: { ...this.#headers, ...headers },
      body: JSON.stringify({
        error: this.#makeResponse(),
      }),
    };
  }

  #makeResponse() {
    if (typeof this.message === 'string') return this.message;
    if (this.message instanceof Error) return this.message?.toString();
    if (typeof this.message === 'object') return JSON.stringify(this.message);
    return this.message?.toString();
  }
}

module.exports = { Response };
