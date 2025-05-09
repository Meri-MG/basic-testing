import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
describe('throttledGetDataFromApi', () => {
  const url = '/albums'


  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: [
      {
        userId: 1,
        id: 1,
        title: 'My First Album'
      }
    ]});
    const mockedCreate = jest.fn().mockReturnValue({ get: mockedGet });
    (axios.create as jest.Mock) = mockedCreate;

    await throttledGetDataFromApi(url);
    jest.advanceTimersByTime(5000); 

    expect(mockedCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: [
      {
        userId: 1,
        id: 1,
        title: 'My First Album'
      }
    ]});
    (axios.create as jest.Mock).mockReturnValue({ get: mockedGet });

    await throttledGetDataFromApi(url);
    jest.advanceTimersByTime(5000); 

    expect(mockedGet).toHaveBeenCalledWith(url);
  });

  test('should return response data', async () => {  
    const mockedGet = jest.fn().mockResolvedValue({ data: [
      {
        userId: 1,
        id: 1,
        title: 'My First Album'
      }
    ]});
    (axios.create as jest.Mock).mockReturnValue({ get: mockedGet });
    const throttled = throttledGetDataFromApi(url);
    jest.advanceTimersByTime(5000);
    const data = await throttled;

    expect(data[0].title).toEqual('My First Album');
    expect(mockedGet).toHaveBeenCalledWith(url);
  });
});
