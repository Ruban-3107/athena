import { render } from '@testing-library/react';
import ManageBatches from './ManageBatches';
describe('ManageBatches', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageBatches />);
    expect(baseElement).toBeTruthy();
  });
});
