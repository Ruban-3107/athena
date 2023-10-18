import { render } from '@testing-library/react';
import Span from './Span';
describe('Span', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Span />);
    expect(baseElement).toBeTruthy();
  });
});
