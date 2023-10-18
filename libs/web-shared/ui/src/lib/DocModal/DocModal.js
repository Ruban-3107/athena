import React from 'react';
import { Modal } from 'react-bootstrap';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export const DocModal = ({ docState, setdocState, isModal }) => {

  const handleClose = () => {
    setdocState({
      ...docState,
      open: false,
    });
  };

  const docs = [{ uri: docState?.url}];

  const renderDocViewer = () => (
    <DocViewer
      pluginRenderers={DocViewerRenderers}
      documents={docs}
      prefetchMethod='GET'
      config={{
        header: {
          disableHeader: !docState.header,
          disableFileName: false,
          retainURLParams: false
        }
      }}
    />
  );

  return (
    isModal ? (
      <Modal show={docState.open} onHide={handleClose} style={{ minHeight: '500px' }}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Document Viewer</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>{renderDocViewer()}</Modal.Body>
      </Modal>
    ) : (
      renderDocViewer()
    )
  );
}

export default DocModal;
