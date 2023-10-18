import { render } from '@testing-library/react';
import Configure from './Configure';
describe('Configure', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Configure />);
    expect(baseElement).toBeTruthy();
  });
});
