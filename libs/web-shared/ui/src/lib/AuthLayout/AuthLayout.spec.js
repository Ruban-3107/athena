import { render } from '@testing-library/react';
import AuthLayout from './AuthLayout';
describe('AuthLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthLayout />);
    expect(baseElement).toBeTruthy();
  });
});
