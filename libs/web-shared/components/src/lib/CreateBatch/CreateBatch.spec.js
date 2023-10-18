import { render } from '@testing-library/react';
import CreateBatch from './CreateBatch';
describe('CreateBatch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateBatch />);
    expect(baseElement).toBeTruthy();
  });
});
