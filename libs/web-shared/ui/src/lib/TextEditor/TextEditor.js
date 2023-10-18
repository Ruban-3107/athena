import './TextEditor.css';
import React, { useState } from 'react';
import {
  ContentState,
  convertToRaw,
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {
  DeleteIcon,
  BoldTextIcon,
  ItalicTextIcon,
  UnderlineTextIcon,
  IconWithTitle,
} from '@athena/web-shared/ui';

export const TextEditor = () => {
  const _contentState = ContentState.createFromText('Enter text here...');
  const raw = convertToRaw(_contentState); // RawDraftContentState JSON
  const [contentState, setContentState] = useState(raw); // ContentState JSON

  const handleCodeBlockClick = () => {
    const newContentState = Modifier.setBlockType(
      contentState,
      contentState.getSelection(),
      'code-block'
    );
    setContentState(newContentState);
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setContentState(convertToRaw(newState.getCurrentContent()));
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div
      className="Text"
      style={{
        width: '100%',
        border: '1px solid lightgrey',
        borderRadius: '5px ',
      }}
    >
      <Editor
        // toolbar={{
        //   options: ['fontSize', 'inline', 'link', 'textAlign'],
        //   inline: {
        //     options: ['bold', 'italic', 'underline'],
        //     bold: {
        //       icon: <BoldTextIcon />,
        //       className: 'bordered-option-classname',
        //     },
        //     italic: {
        //       icons: <ItalicTextIcon />,
        //       className: 'bordered-option-classname',
        //     },
        //     underline: {
        //       icons: <UnderlineTextIcon />,

        //       className: 'bordered-option-classname',
        //     },
        //   },

        //   fontSize: {
        //     className: 'bordered-option-classname',
        //   },

        // }}

        toolbar={{
          options: ['fontSize', 'inline', 'link', 'textAlign', 'image'],
          inline: {
            options: ['bold', 'italic', 'underline'],
          },
          image: {
            icons: <BoldTextIcon />,
            className: 'demo-option-custom',
            popupClassName: 'demo-popup-custom',
          },
          //   customOptions: [
          //     {
          //       icon: <DeleteIcon />,
          //       onClick: handleCodeBlockClick,
          //       title: 'Insert code block',
          //     },
          //   ],
        }}
      />
    </div>
  );
};

export default TextEditor;

