import { render } from '@testing-library/react';
import CreateExercise from './CreateExercise';
describe('CreateExercise', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateExercise />);
    expect(baseElement).toBeTruthy();
  });
});
