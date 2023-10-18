import { render } from '@testing-library/react';
import Bulkfileupload from './Bulkfileupload';
describe('Bulkfileupload', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Bulkfileupload />);
    expect(baseElement).toBeTruthy();
  });
});
