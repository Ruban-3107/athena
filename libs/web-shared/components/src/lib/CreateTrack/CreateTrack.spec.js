import { render } from '@testing-library/react';
import CreateTrack from './CreateTrack';
describe('CreateTrack', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateTrack />);
    expect(baseElement).toBeTruthy();
  });
});
