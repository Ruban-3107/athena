import { render } from '@testing-library/react';
import ManageTracks from './ManageTracks';
describe('ManageTracks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageTracks />);
    expect(baseElement).toBeTruthy();
  });
});
