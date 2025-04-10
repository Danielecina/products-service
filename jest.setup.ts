import { Logger } from '@nestjs/common';

jest.mock('@nestjs/common', () => {
  const originalModule: typeof import('@nestjs/common') =
    jest.requireActual('@nestjs/common');

  return {
    ...originalModule,
    Logger: jest.fn().mockImplementation(() => ({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      overrideLogger: jest.fn(),
    })),
  };
});

Logger.log = jest.fn();
Logger.error = jest.fn();
Logger.warn = jest.fn();
Logger.debug = jest.fn();
Logger.verbose = jest.fn();
Logger.overrideLogger = jest.fn();
