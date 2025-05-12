import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.withdraw(120)).toThrow('Insufficient funds: cannot withdraw more than 100');
    expect(() => account.withdraw(120)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(120, account)).toThrow('Transfer failed');
    expect(() => account.transfer(120, account)).toThrow(TransferFailedError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    expect(account.deposit(50)).toEqual({"_balance": 150});
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    expect(account.withdraw(50)).toEqual({"_balance": 50});
  });

  test('should transfer money', () => {
    const account = getBankAccount(100);
    expect(account.transfer(50, getBankAccount(0))).toEqual({"_balance": 50});
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(42);

    await expect(account.fetchBalance()).resolves.toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(42);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
    await expect(account.synchronizeBalance()).rejects.toThrow('Synchronization failed');});
});
