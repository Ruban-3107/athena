import { render } from '@testing-library/react';
import ManageCorporate from './ManageCorporate';
describe('ManageCorporate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageCorporate />);
    expect(baseElement).toBeTruthy();
  });
});
