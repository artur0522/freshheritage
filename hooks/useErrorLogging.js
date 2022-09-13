import * as Sentry from '@sentry/nextjs';

const useErrorLogging = () => {
  const logError = (type, error) => {
    console.error(`${type}: `, error);
    if (error instanceof Error) {
      Sentry.captureException(error, {tags: {type: type}});
    } else {
      Sentry.captureMessage(`${type}: ${error}`, {tags: {type: type}});
    }
  };

  return logError
}

export default useErrorLogging
