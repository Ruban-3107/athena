import { render } from '@testing-library/react';
import VideoModal from './VideoModal';
describe('VideoModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VideoModal />);
    expect(baseElement).toBeTruthy();
  });
});
