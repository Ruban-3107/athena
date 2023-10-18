import { render } from '@testing-library/react';
import NumberDropDown from './number-drop-down';
describe('NumberDropDown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NumberDropDown />);
    expect(baseElement).toBeTruthy();
  });
});
