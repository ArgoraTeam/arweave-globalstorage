import { GlobalStorage } from '../index';

test('default', () => {
  expect(GlobalStorage('Carl')).toBe('Hello Carl');
});