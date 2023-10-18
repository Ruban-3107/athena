import { render } from '@testing-library/react';
import ManageCourses from './ManageCourses';
describe('ManageCourses', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageCourses />);
    expect(baseElement).toBeTruthy();
  });
});
