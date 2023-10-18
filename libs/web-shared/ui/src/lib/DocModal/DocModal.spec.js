import { render } from '@testing-library/react';
import DocModal from './DocModal';
describe('DocModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocModal />);
    expect(baseElement).toBeTruthy();
  });
});
