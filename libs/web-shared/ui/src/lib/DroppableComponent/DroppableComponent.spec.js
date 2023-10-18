import { render } from '@testing-library/react';
import DroppableComponent from './DroppableComponent';
describe('DroppableComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DroppableComponent />);
    expect(baseElement).toBeTruthy();
  });
});
