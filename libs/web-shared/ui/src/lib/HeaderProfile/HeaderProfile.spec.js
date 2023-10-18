import { render } from '@testing-library/react';
import HeaderProfile from './HeaderProfile';
describe('HeaderProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeaderProfile />);
    expect(baseElement).toBeTruthy();
  });
});
