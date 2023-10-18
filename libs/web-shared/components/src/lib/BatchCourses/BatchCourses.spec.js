import { render } from '@testing-library/react';
import BatchCourses from './BatchCourses';
describe('BatchCourses', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BatchCourses />);
    expect(baseElement).toBeTruthy();
  });
});
