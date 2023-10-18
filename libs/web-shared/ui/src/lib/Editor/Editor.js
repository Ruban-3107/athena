import './Editor.css';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { BasicSetupConfig } from './configuration/basic-setup';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { color } from '@uiw/codemirror-extensions-color';
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';
// import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { javascript } from '@codemirror/lang-javascript';
import { useEffect } from 'react';

export function Editor({ value, language, valueChanges, isEditable }) {
  useEffect(()=>{
console.log("ffffffffffffffff",value, language, valueChanges, isEditable);
  },[])

  const onChange = React.useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);
  return (
    // <CodeMirror
    //   height="500px"
    //   basicSetup={BasicSetupConfig}
    //   value={value}
    //   theme={xcodeLight}
    //   editable={isEditable}
    //   // readOnly={true}
    //   extensions={[color, hyperLink, loadLanguage(language)]}
    //   onChange={(value, viewUpdate) => {
    //     valueChanges(value);
    //   }}
    // />

    <CodeMirror
    className='editstyle'
    value= {value} 
    height="450px"
    extensions={[javascript({ jsx: true })]}
    onChange={onChange}
  />

  );
}

export default Editor;
