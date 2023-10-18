import { render } from '@testing-library/react';
import ReactSelect from './ReactSelect';
describe('ReactSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactSelect />);
    expect(baseElement).toBeTruthy();
  });
});
