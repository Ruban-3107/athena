import  BaseResponse  from './Errors/BaseResponse';

describe('sharedModules', () => {
  it('should work', () => {
    expect(BaseResponse).toEqual('shared-modules');
  });
});
