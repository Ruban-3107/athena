import { render } from '@testing-library/react';
import ProgressComponent from './ProgressComponent';
describe('ProgressComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgressComponent />);
    expect(baseElement).toBeTruthy();
  });
});
