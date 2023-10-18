import { render } from '@testing-library/react';
import AddUsers from './AddUsers';
describe('AddUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddUsers />);
    expect(baseElement).toBeTruthy();
  });
});
