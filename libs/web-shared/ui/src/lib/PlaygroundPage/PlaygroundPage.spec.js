import { render } from '@testing-library/react';
import PlaygroundPage from './PlaygroundPage';
describe('PlaygroundPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlaygroundPage />);
    expect(baseElement).toBeTruthy();
  });
});
