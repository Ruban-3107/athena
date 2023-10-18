import { render } from '@testing-library/react';
import CardBox from './CardBox';
describe('CardBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardBox />);
    expect(baseElement).toBeTruthy();
  });
});
