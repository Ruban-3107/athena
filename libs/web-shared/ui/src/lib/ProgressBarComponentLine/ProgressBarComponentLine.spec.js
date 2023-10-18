import { render } from '@testing-library/react';
import ProgressBarComponentLine from './ProgressBarComponentLine';
describe('ProgressBarComponentLine', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgressBarComponentLine />);
    expect(baseElement).toBeTruthy();
  });
});
