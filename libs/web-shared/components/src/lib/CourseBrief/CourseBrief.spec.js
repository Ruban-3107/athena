import { render } from '@testing-library/react';
import CourseBrief from './CourseBrief';
describe('CourseBrief', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CourseBrief />);
    expect(baseElement).toBeTruthy();
  });
});
