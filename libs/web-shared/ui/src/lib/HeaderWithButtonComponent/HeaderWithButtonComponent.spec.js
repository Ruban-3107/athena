import { render } from '@testing-library/react';
import HeaderWithButtonComponent from './HeaderWithButtonComponent';
describe('HeaderWithButtonComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeaderWithButtonComponent />);
    expect(baseElement).toBeTruthy();
  });
});
