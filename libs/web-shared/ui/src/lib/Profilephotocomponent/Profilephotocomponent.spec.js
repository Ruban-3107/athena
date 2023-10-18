import { render } from '@testing-library/react';
import Profilephotocomponent from './Profilephotocomponent';
describe('Profilephotocomponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Profilephotocomponent />);
    expect(baseElement).toBeTruthy();
  });
});
