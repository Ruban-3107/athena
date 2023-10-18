import { sharedFileUpload } from './shared-file-upload';

describe('sharedFileUpload', () => {
  it('should work', () => {
    expect(sharedFileUpload()).toEqual('shared-file-upload');
  });
});
