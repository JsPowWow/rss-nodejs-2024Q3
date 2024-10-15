import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const identity = (d: unknown) => d;
  const originalModule = jest.requireActual<typeof import('lodash')>('lodash');
  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn(identity),
  };
});

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  let mockedCreate: jest.Mock;
  let mockedGet: jest.Mock;

  beforeEach(() => {
    mockedGet = jest.fn().mockResolvedValue({ data: 'The data' });
    mockedCreate = jest.fn(() => ({ get: mockedGet }));
    axios.create = mockedCreate;
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/todos');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/todos');
    expect(mockedGet).toHaveBeenCalledWith('/todos');
  });

  test('should return response data', async () => {
    const data = Object.freeze({ todos: ['do some', 'do something else'] });
    mockedGet.mockResolvedValue({ data });

    const result = await throttledGetDataFromApi('/todos');
    expect(result).toStrictEqual(data);
  });
});
