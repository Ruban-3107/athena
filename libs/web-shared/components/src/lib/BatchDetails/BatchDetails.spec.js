import { render } from '@testing-library/react';
import BatchDetails from './BatchDetails';
describe('BatchDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BatchDetails />);
    expect(baseElement).toBeTruthy();
  });
});
