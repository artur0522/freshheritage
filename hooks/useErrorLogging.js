const useErrorLogging = () => {
  const logError = (type, error) => {
    console.error(`${type}: `, error);
  };

  return logError
}

export default useErrorLogging
