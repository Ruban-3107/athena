import { render } from '@testing-library/react';
import HeaderComponent from './HeaderComponent';
describe('HeaderComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeaderComponent />);
    expect(baseElement).toBeTruthy();
  });
});
