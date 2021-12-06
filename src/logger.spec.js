const { Logger } = require('./logger');

describe('logger', () => {
  const BASE_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...BASE_ENV };
  });

  afterAll(() => {
    process.env = BASE_ENV;
  });

  describe('logger instantiation', () => {
    it('should throw an error when no stage is specified in the environment', () => {
      expect(() => new Logger()).toThrowError(/No stage/);
    });

    it('should throw an error when no log level is specified in the environment', () => {
      process.env.STAGE = 'dev';
      expect(() => new Logger()).toThrowError(/No log level/);
    });

    it("should throw an error when log level specified doesn't match error, info or debug", () => {
      process.env.STAGE = 'dev';
      process.env.LOG_LEVEL = 'test';
      const errorRegex = new RegExp(
        `Invalid log level: '${process.env.LOG_LEVEL}'`,
      );
      expect(() => new Logger()).toThrowError(errorRegex);
    });

    it('should throw an error when no stack name are specified in the environment', () => {
      process.env.STAGE = 'dev';
      process.env.LOG_LEVEL = 'error';
      expect(() => new Logger()).toThrowError(/No stack name/);
    });

    it('should not throw when stage, a valid log level and stack name are specified in the environment', () => {
      process.env.STAGE = 'dev';
      process.env.LOG_LEVEL = 'error';
      process.env.STACK_NAME = 'test';
      expect(() => new Logger()).not.toThrow();
    });
  });

  describe('logger usage', () => {
    let consoleMocks;
    const MESSAGE = 'test';
    const formatMessage = (...msg) =>
      `${process.env.STACK_NAME.toUpperCase()}: ${JSON.stringify(
        msg.length ? msg : [MESSAGE],
      )}`;

    beforeEach(() => {
      process.env.STAGE = 'dev';
      process.env.LOG_LEVEL = 'debug';
      process.env.STACK_NAME = 'test';

      consoleMocks = [
        jest.spyOn(global.console, 'log').mockImplementation(() => {}),
        jest.spyOn(global.console, 'error').mockImplementation(() => {}),
        jest.spyOn(global.console, 'debug').mockImplementation(() => {}),
        jest.spyOn(global.console, 'info').mockImplementation(() => {}),
      ];
    });

    afterEach(() => {
      consoleMocks.forEach((mock) => mock.mockRestore());
    });

    describe('logger log', () => {
      let logger;

      beforeEach(() => {
        logger = new Logger();
      });

      it('should show log message once with provided message', () => {
        logger.log(MESSAGE);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(formatMessage());
      });

      it('should not show log message if production environment is active', () => {
        process.env.STAGE = 'prod';
        const logger = new Logger();
        logger.log(MESSAGE);
        expect(console.log).not.toHaveBeenCalled();
      });

      it('should show log message with lot of provided messages', () => {
        const message = [MESSAGE, MESSAGE, MESSAGE, MESSAGE];
        logger.log(...message);
        expect(console.log).toHaveBeenCalledWith(formatMessage(...message));
      });
    });

    describe('logger debug', () => {
      let logger;

      beforeEach(() => {
        process.env.LOG_LEVEL = 'debug';
        logger = new Logger();
      });

      it('should show debug message once with provided message', () => {
        logger.debug(MESSAGE);
        expect(console.debug).toHaveBeenCalledTimes(1);
        expect(console.debug).toHaveBeenCalledWith(formatMessage());
      });

      it('should not show debug message if log level is set as info', () => {
        process.env.LOG_LEVEL = 'info';
        const logger = new Logger();
        logger.debug(MESSAGE);
        expect(console.debug).not.toHaveBeenCalled();
      });

      it('should not show debug message if log level is set as error', () => {
        process.env.LOG_LEVEL = 'error';
        const logger = new Logger();
        logger.debug(MESSAGE);
        expect(console.debug).not.toHaveBeenCalled();
      });
    });

    describe('logger debug no stringify', () => {
      let logger;
      const LABEL = 'DEBUG';

      beforeEach(() => {
        process.env.LOG_LEVEL = 'debug';
        logger = new Logger();
      });

      it('should show debug without stringify once with provided message', () => {
        logger.debugNoStringify(LABEL, MESSAGE);
        expect(console.debug).toHaveBeenCalledTimes(1);
        expect(console.debug).toHaveBeenCalledWith(LABEL, [MESSAGE]);
      });

      it('should not show debug without stringify if log level is set as error', () => {
        process.env.LOG_LEVEL = 'error';
        const logger = new Logger();
        logger.debugNoStringify(LABEL, MESSAGE);
        expect(console.debug).not.toHaveBeenCalled();
      });

      it('should not show debug without stringify if log level is set as info', () => {
        process.env.LOG_LEVEL = 'info';
        const logger = new Logger();
        logger.debugNoStringify(LABEL, MESSAGE);
        expect(console.debug).not.toHaveBeenCalled();
      });
    });

    describe('logger info', () => {
      let logger;

      beforeEach(() => {
        process.env.LOG_LEVEL = 'info';
        logger = new Logger();
      });

      it('should show info message once with provided message', () => {
        logger.info(MESSAGE);
        expect(console.info).toHaveBeenCalledTimes(1);
        expect(console.info).toHaveBeenCalledWith(formatMessage());
      });

      it('should not show info message if log level is set as error', () => {
        process.env.LOG_LEVEL = 'error';
        const logger = new Logger();
        logger.info(MESSAGE);
        expect(console.info).not.toHaveBeenCalled();
      });

      it('should show info message when log level is set as debug', () => {
        process.env.LOG_LEVEL = 'debug';
        const logger = new Logger();
        logger.info(MESSAGE);
        expect(console.info).toHaveBeenCalledTimes(1);
        expect(console.info).toHaveBeenCalledWith(formatMessage());
      });
    });

    describe('logger error', () => {
      let logger;

      beforeEach(() => {
        process.env.LOG_LEVEL = 'error';
        logger = new Logger();
      });

      it('should show error message once with provided message', () => {
        logger.error(MESSAGE);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(formatMessage());
      });

      it('should show error message when log level is set as debug', () => {
        process.env.LOG_LEVEL = 'debug';
        const logger = new Logger();
        logger.error(MESSAGE);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(formatMessage());
      });

      it('should show error message when log level is set as info', () => {
        process.env.LOG_LEVEL = 'info';
        const logger = new Logger();
        logger.error(MESSAGE);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(formatMessage());
      });

      it('should show error message with stacktrace when Error instance is provided', () => {
        const error = new Error(MESSAGE);
        logger.error(error);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(error);
      });
    });

    describe('logger audit', () => {
      let logger;

      beforeEach(() => {
        logger = new Logger();
      });

      it('should show audit message in production environment', () => {
        process.env.STAGE = 'prod';
        logger.audit(MESSAGE);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(formatMessage());
      });

      it('should show audit message when log level is set as error', () => {
        process.env.LOG_LEVEL = 'error';
        const logger = new Logger();
        logger.audit(MESSAGE);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(formatMessage());
      });

      it('should show audit message when log level is set as info', () => {
        process.env.LOG_LEVEL = 'info';
        const logger = new Logger();
        logger.audit(MESSAGE);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(formatMessage());
      });

      it('should show audit message when log level is set as debug', () => {
        process.env.LOG_LEVEL = 'debug';
        const logger = new Logger();
        logger.audit(MESSAGE);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(formatMessage());
      });
    });
  });
});
