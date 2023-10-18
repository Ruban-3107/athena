import { render } from '@testing-library/react';
import CreateCourse from './CreateCourse';
describe('CreateCourse', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateCourse />);
    expect(baseElement).toBeTruthy();
  });
});
