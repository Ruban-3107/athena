import { render } from '@testing-library/react';
import CreateRole from './CreateRole';
describe('CreateRole', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateRole />);
    expect(baseElement).toBeTruthy();
  });
});
