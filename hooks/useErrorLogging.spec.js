import { default as useErrorLogging } from './useErrorLogging';
import * as Sentry from '@sentry/nextjs';

jest.mock('@sentry/nextjs');

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
};

describe('useErrorLogging', () => {
  describe('logError', () => {
    it('should log error to console', () => {
      const logError = useErrorLogging();
      logError('type_of_error', 'ERRRRROR');
      expect(global.console.error).toHaveBeenCalledWith('type_of_error: ', 'ERRRRROR');
    });

    it('should send exception to sentry', () => {
      const logError = useErrorLogging();
      const error = new Error('ERRRRROR');
      logError('type_of_error', error);
      expect(Sentry.captureException).toHaveBeenCalledWith(error, {tags: {type: 'type_of_error'}});
    });

    it('should send non-exception error to sentry', () => {
      const logError = useErrorLogging();
      logError('type_of_error', 'ERRRRROR');
      expect(Sentry.captureMessage).toHaveBeenCalledWith('type_of_error: ERRRRROR', {tags: {type: 'type_of_error'}});
    });
  });
});
