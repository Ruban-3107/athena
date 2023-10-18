import { render } from '@testing-library/react';
import DraggableComponent from './DraggableComponent';
describe('DraggableComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DraggableComponent />);
    expect(baseElement).toBeTruthy();
  });
});
