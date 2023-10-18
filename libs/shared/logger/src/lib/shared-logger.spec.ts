import { sharedLogger } from './shared-logger';

describe('sharedLogger', () => {
  it('should work', () => {
    expect(sharedLogger()).toEqual('shared-logger');
  });
});
