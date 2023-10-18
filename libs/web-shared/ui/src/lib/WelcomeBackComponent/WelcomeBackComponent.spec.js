import { render } from '@testing-library/react';
import WelcomeBackComponent from './WelcomeBackComponent';
describe('WelcomeBackComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WelcomeBackComponent />);
    expect(baseElement).toBeTruthy();
  });
});
