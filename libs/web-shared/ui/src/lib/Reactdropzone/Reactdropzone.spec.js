import { render } from '@testing-library/react';
import Reactdropzone from './Reactdropzone';
describe('Reactdropzone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Reactdropzone />);
    expect(baseElement).toBeTruthy();
  });
});
