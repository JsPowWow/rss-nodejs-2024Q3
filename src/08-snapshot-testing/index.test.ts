import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const trip = ['Kiev', 'Krakow', 'Gdansk'];
    const tripLinkedList = Object.freeze({
      value: 'Kiev',
      next: {
        value: 'Krakow',
        next: {
          value: 'Gdansk',
          next: {
            next: null,
            value: null,
          },
        },
      },
    });
    expect(generateLinkedList(trip)).toStrictEqual(tripLinkedList);
  });

  test('should generate linked list from values 2', () => {
    const courses = Object.freeze([
      Object.freeze({ name: 'Node Basic' }),
      Object.freeze({ name: 'Node Tests' }),
      Object.freeze({ name: 'Node Crud' }),
    ]);
    expect(generateLinkedList(courses as { name: string }[])).toMatchSnapshot();
  });
});
