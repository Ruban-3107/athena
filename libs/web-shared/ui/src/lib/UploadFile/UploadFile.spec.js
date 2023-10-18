import { render } from '@testing-library/react';
import UploadFile from './UploadFile';
describe('UploadFile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UploadFile />);
    expect(baseElement).toBeTruthy();
  });
});
