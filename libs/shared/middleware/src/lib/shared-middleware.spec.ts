import { sharedMiddleware } from './shared-middleware';

describe('sharedMiddleware', () => {
  it('should work', () => {
    expect(sharedMiddleware()).toEqual('shared-middleware');
  });
});
