import { render } from '@testing-library/react';
import IndustryCertificate from './IndustryCertificate';
describe('IndustryCertificate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IndustryCertificate />);
    expect(baseElement).toBeTruthy();
  });
});
