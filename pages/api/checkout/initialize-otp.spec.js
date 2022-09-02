import handler from './initialize-otp';

const fetchMock = jest.fn();

const send = jest.fn(() => {});
const stts = jest.fn(() => {});
const json = jest.fn(() => {});

describe('intialize-otp', () => {
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
    it('should call checkout function keep alive', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock
        .mockImplementationOnce(async () => {
          return {
            ok: true,
            statusText: 200,
          };
        })
        .mockImplementationOnce(async () => {
          return {
            json: async () => {
              return data;
            }
          }
        });

      const req = {
        body: JSON.stringify({})
      };

      await handler(req, response);

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.SITKA_GOOGLE_FUNCTION_BASE_URL}/checkout/keepAlive`,
        {
          headers: {
            'x-api-key': process.env.SITKA_GOOGLE_FUNCTION_KEY,
            'origin': 'pwa'
          },
          method: 'POST'
        }
      );
    });

    it('should continue if keep alive function throws error', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock
        .mockImplementationOnce(async () => {
          throw new Error('this happened, not good');
        })
        .mockImplementationOnce(async () => {
          return {
            json: async () => {
              return data;
            }
          }
        });

      const req = {
        body: JSON.stringify({})
      };

      await handler(req, response);

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.SITKA_GOOGLE_FUNCTION_BASE_URL}/checkout/keepAlive`,
        {
          headers: {
            'x-api-key': process.env.SITKA_GOOGLE_FUNCTION_KEY,
            'origin': 'pwa'
          },
          method: 'POST'
        }
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should call bold checkout init API', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock
        .mockImplementationOnce(async () => {
          throw new Error('this happened, not good');
        })
        .mockImplementationOnce(async () => {
          return {
            json: async () => {
              return data;
            }
          }
        });

      const reqBody = {
        products: [
          {
            platform_id: '12345',
            quantity: 3,
            line_item_key: 4,
            line_item_properties: {this_is: 'properties'}
          },
          {
            platform_id: '67890',
            quantity: 4,
            line_item_key: 5,
            line_item_properties: {this_is: 'also properties'}
          },
          {
            platform_id: '543321',
            quantity: 5,
            line_item_key: 6,
            line_item_properties: {this_is: 'properties'}
          }
        ],
        customer: {this_is: 'customer'},
        order_meta_data: {this_is: 'meta_data'}
      };

      const req = {
        body: JSON.stringify(reqBody)
      };

      const expectedBody = {
        cart_items: reqBody.products,
        customer: reqBody.customer,
        order_meta_data: reqBody.order_meta_data
      };

      await handler(req, response);

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.boldcommerce.com/checkout/orders/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/init`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.BOLD_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expectedBody)
        }
      );
    });

    it('should return bold api response', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock
        .mockImplementationOnce(async () => {
          throw new Error('this happened, not good');
        })
        .mockImplementationOnce(async () => {
          return {
            json: async () => {
              return data;
            }
          }
        });

      const reqBody = {
        products: [
          {
            platform_id: '12345',
            quantity: 3,
            line_item_key: 4,
            line_item_properties: {this_is: 'properties'}
          },
          {
            platform_id: '67890',
            quantity: 4,
            line_item_key: 5,
            line_item_properties: {this_is: 'also properties'}
          },
          {
            platform_id: '543321',
            quantity: 5,
            line_item_key: 6,
            line_item_properties: {this_is: 'properties'}
          }
        ],
        customer: {this_is: 'customer'},
        order_meta_data: {this_is: 'meta_data'}
      };

      const req = {
        body: JSON.stringify(reqBody)
      };

      await handler(req, response);

      expect(stts).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(data);
      expect(send).toHaveBeenCalled();
    });

    it('should return 500 if bold API throws error', async () => {
      const data = {good: 'stuff', data: 'the best'};
      fetchMock
        .mockImplementationOnce(async () => {
          throw new Error('this happened, not good');
        })
        .mockImplementationOnce(async () => {
          throw new Error('this also happened, not better');
        });

      const reqBody = {
        products: [
          {
            platform_id: '12345',
            quantity: 3,
            line_item_key: 4,
            line_item_properties: {this_is: 'properties'}
          },
          {
            platform_id: '67890',
            quantity: 4,
            line_item_key: 5,
            line_item_properties: {this_is: 'also properties'}
          },
          {
            platform_id: '543321',
            quantity: 5,
            line_item_key: 6,
            line_item_properties: {this_is: 'properties'}
          }
        ],
        customer: {this_is: 'customer'},
        order_meta_data: {this_is: 'meta_data'}
      };

      const req = {
        body: JSON.stringify(reqBody)
      };

      await handler(req, response);

      expect(stts).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalled();
    });
  });
});