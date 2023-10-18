import { render } from '@testing-library/react';
import ManageUsers from './ManageUsers';
describe('ManageUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageUsers />);
    expect(baseElement).toBeTruthy();
  });
});
