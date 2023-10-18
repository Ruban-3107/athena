import { render } from '@testing-library/react';
import HeaderWithButton from './HeaderWithButton';
describe('HeaderWithButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeaderWithButton />);
    expect(baseElement).toBeTruthy();
  });
});
