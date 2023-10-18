import { render } from '@testing-library/react';
import UserProfileOffcanvas from './UserProfileOffcanvas';
describe('UserProfileOffcanvas', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserProfileOffcanvas />);
    expect(baseElement).toBeTruthy();
  });
});
