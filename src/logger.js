/**
 * Log messages to the console in a consistent format.
 */
class Logger {
  #isProduction = false;
  #logLevel = 3;
  #logLevelMap = {
    error: 1,
    info: 2,
    debug: 3,
  };

  /**
   * Create a new Logger instance.
   */
  constructor() {
    const stage = process.env.stage || process.env.STAGE;

    if (!stage) throw new Error('No stage specified in the environment');

    this.#isProduction = stage.toLowerCase().startsWith('prod');
    this.#logLevel = this.#setLogLevel();
  }

  #setLogLevel() {
    const logLevel = process.env.logLevel || process.env.LOG_LEVEL;

    if (!logLevel) throw new Error('No log level specified in the environment');

    return this.#logLevelMap[logLevel.toLowerCase()];
  }

  #formatMessage(message) {
    return `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`;
  }

  /**
   * Used to log a message to the console when debug log level is enabled.
   *
   * @param  {...any} message Message to log, can be anything that can be stringified.
   */
  debug(...message) {
    if (this.#logLevel < 3) return;

    console.debug(this.#formatMessage(message));
  }

  /**
   * Used to log a message to the console without stringifying it.
   * It doesn't depends on the log level.
   * Need to be labeled by hand.
   *
   * @param {string} label Label to log.
   * @param {...any} message Message to log, can be anything.
   */
  debugNoStringify(label, ...message) {
    if (this.#logLevel < 3) return;

    console.debug(label, message);
  }

  /**
   * Used to log a message to the console when info or debug log level is enabled.
   *
   * @param  {...any} message Message to log, can be anything that can be stringified.
   */
  info(...message) {
    if (this.#logLevel < 2) return;

    console.info(this.#formatMessage(message));
  }

  /**
   * Used to log a message to the console when any log level is enabled.
   * If message provided is an Error, it will be logged with the stack trace.
   *
   * @param  {...any} message Message to log, can be anything that can be stringified.
   */
  error(...message) {
    if (this.#logLevel < 1) return;

    if (message instanceof Error) console.error(message);
    else console.error(this.#formatMessage(message));
  }

  /**
   * Used to log a message to the console without depends on the log level.
   *
   * @param  {...any} message Message to log, can be anything that can be stringified.
   */
  audit(...message) {
    console.log(this.#formatMessage(message));
  }

  /**
   * Used to log a message to the console when any log level is enabled.
   * Doesn't works if production environment is enabled.
   *
   * @param  {...any} message Message to log, can be anything that can be stringified.
   */
  log(...message) {
    if (this.#isProduction) return;

    console.log(this.#formatMessage(message));
  }
}

module.exports = { Logger };
