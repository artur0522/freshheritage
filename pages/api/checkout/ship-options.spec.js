import handler from './ship-options';

const fetchMock = jest.fn();

const send = jest.fn(() => {});
const stts = jest.fn(() => {});
const json = jest.fn(() => {});

describe('ship-options', () => {
  let response;

  beforeAll(() => {
    global.fetch = fetchMock;
  });

  beforeEach(() => {
    response = {
      send: send,
      status: stts,
      json: json
    };

    stts.mockReturnValue(response);
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  describe('handler', () => {
    it('should call google function with provided input', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock.mockReturnValue({
        ok: true,
        json: () => {
          return data;
        }
      });
      
      const req = {
        body: {
          zip: '12345',
          bundledShipWeek: 35
        }
      };

      await handler(req, response);

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.SITKA_GOOGLE_FUNCTION_BASE_URL}/checkout/shippingOptions`,
        {
          headers: {
            'x-api-key': process.env.SITKA_GOOGLE_FUNCTION_KEY,
            'origin': 'pwa',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            zip: '12345',
            bundledShipWeek: 35
          })
        }
      )
    });

    it('should return response', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock.mockReturnValue({
        ok: true,
        json: () => {
          return data;
        }
      });
      
      const req = {
        body: {
          zip: '12345',
          bundledShipWeek: 35
        }
      };

      await handler(req, response);

      expect(json).toHaveBeenCalledWith(data);
      expect(send).toHaveBeenCalledTimes(1);
      expect(stts).toHaveBeenCalledWith(200);
    });

    it('should return 500 if response was not ok', async () => {
      fetchMock.mockReturnValue({
        ok: false,
      });
      
      const req = {
        body: {
          zip: '12345',
          bundledShipWeek: 35
        }
      };

      await handler(req, response);

      expect(json).not.toHaveBeenCalled();
      expect(send).toHaveBeenCalledTimes(1);
      expect(stts).toHaveBeenCalledWith(500);
    });

    it('should return 500 if error thrown', async () => {
      fetchMock.mockRejectedValueOnce(new Error('bad stuff happened'));
      
      const req = {
        body: {
          zip: '12345',
          bundledShipWeek: 35
        }
      };

      await handler(req, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(stts).toHaveBeenCalledWith(500);
    });
  });
});