import { render } from '@testing-library/react';
import AuthFooter from './AuthFooter';
describe('AuthFooter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthFooter />);
    expect(baseElement).toBeTruthy();
  });
});
