import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  beforeEach(() => getBankAccount(1000));
  test('should create account with initial balance', () => {
    expect(getBankAccount(45).getBalance()).toBe(45);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 1000;
    const bankAccount: BankAccount = getBankAccount(balance);
    expect(() => bankAccount.withdraw(balance + 1)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 1000;
    const srcBankAccount: BankAccount = getBankAccount(balance);
    const targetBankAccount: BankAccount = getBankAccount(10);
    expect(() =>
      srcBankAccount.transfer(balance + 1, targetBankAccount),
    ).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 1000;
    const srcBankAccount: BankAccount = getBankAccount(balance);
    const targetBankAccount: BankAccount = srcBankAccount;
    expect(() =>
      srcBankAccount.transfer(0.25 * balance, targetBankAccount),
    ).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const bankAccount: BankAccount = getBankAccount(1000);
    bankAccount.deposit(600);
    expect(bankAccount.getBalance()).toBe(1600);
  });

  test('should withdraw money', () => {
    const bankAccount: BankAccount = getBankAccount(1000);
    bankAccount.withdraw(600);
    expect(bankAccount.getBalance()).toBe(400);
  });

  test('should transfer money', () => {
    const srcBankAccount: BankAccount = getBankAccount(1000);
    const targetBankAccount: BankAccount = getBankAccount(2000);
    srcBankAccount.transfer(400, targetBankAccount);
    expect(srcBankAccount.getBalance()).toBe(600);
    expect(targetBankAccount.getBalance()).toBe(2400);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount: BankAccount = getBankAccount(1000);
    const originRandom = lodash.random;
    const spyOnRandom = jest
      .spyOn(lodash, 'random')
      .mockImplementation((...args) => {
        const [min, max] = args;
        if (min === 0 && max === 1) {
          return 0.5;
        }
        return originRandom(0, 100, false);
      });
    const balance = await bankAccount.fetchBalance();
    expect(balance).not.toBeNull();
    expect(typeof balance).toBe('number');
    spyOnRandom.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount: BankAccount = getBankAccount(1000);
    const expectedBalance = 358;
    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockReturnValue(Promise.resolve(expectedBalance));

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(expectedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount: BankAccount = getBankAccount(1000);
    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockReturnValue(Promise.resolve(null));

    expect.assertions(1);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
