import { render } from '@testing-library/react';
import ManageExercises from './ManageExercises';
describe('ManageExercises', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageExercises />);
    expect(baseElement).toBeTruthy();
  });
});
