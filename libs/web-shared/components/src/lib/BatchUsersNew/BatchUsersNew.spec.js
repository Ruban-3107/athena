import { render } from '@testing-library/react';
import BatchUsersNew from './BatchUsersNew';
describe('BatchUsersNew', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BatchUsersNew />);
    expect(baseElement).toBeTruthy();
  });
});
