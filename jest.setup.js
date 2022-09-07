import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

beforeAll(() => {
  // comment out this section to get console logging while testing
  // global.console = {
  //   ...console,
  //   log: jest.fn(),
  //   debug: jest.fn(),
  //   error: jest.fn(),
  //   info: jest.fn(),
  // };
  
  // window.console = {
  //   ...window.console,
  //   log: jest.fn(),
  //   debug: jest.fn(),
  //   error: jest.fn(),
  //   info: jest.fn(),
  // };
  
  // window.scroll = jest.fn();
  // window.scrollTo = jest.fn();
})

afterAll(() => {
  jest.clearAllMocks();
});