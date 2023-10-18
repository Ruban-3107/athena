import { render } from '@testing-library/react';
import BatchUsers from './BatchUsers';
describe('BatchUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BatchUsers />);
    expect(baseElement).toBeTruthy();
  });
});
