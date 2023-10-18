import { render } from '@testing-library/react';
import ManageChapters from './ManageChapters';
describe('ManageChapters', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageChapters />);
    expect(baseElement).toBeTruthy();
  });
});
