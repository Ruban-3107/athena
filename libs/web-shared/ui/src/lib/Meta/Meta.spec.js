import { render } from '@testing-library/react';
import Meta from './Meta';
describe('Meta', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Meta />);
    expect(baseElement).toBeTruthy();
  });
});
