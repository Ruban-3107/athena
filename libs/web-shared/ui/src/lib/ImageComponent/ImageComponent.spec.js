import { render } from '@testing-library/react';
import ImageComponent from './ImageComponent';
describe('ImageComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageComponent />);
    expect(baseElement).toBeTruthy();
  });
});
