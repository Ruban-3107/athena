import { render } from '@testing-library/react';
import DeleteModal from './DeleteModal';
describe('DeleteModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteModal />);
    expect(baseElement).toBeTruthy();
  });
});
