import { render } from '@testing-library/react';
import CertificateModal from './CertificateModal';
describe('CertificateModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CertificateModal />);
    expect(baseElement).toBeTruthy();
  });
});
