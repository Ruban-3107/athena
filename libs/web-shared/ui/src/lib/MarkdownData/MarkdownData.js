import './MarkdownData.css';
import { useEffect, useState, useRef } from 'react';
import { Box, Editor } from '@athena/web-shared/ui';
import { marked } from 'marked';


export function MarkdownData({ data,onData,exerciseData }) {
  console.log("data4", data);
  const [markdown, setMarkdown] = useState('');
  const [exercisemarkdown, setExerciseMarkdown] = useState('');

  useEffect(() => {
    if (data) {
      setMarkdown(marked(data));
    } else {
      setMarkdown('');
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(data);
        const text = await response.text();
        setExerciseMarkdown(text);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    };
    fetchData();
  }, [exerciseData]);


  const sendData = (markdown) => {
    if (onData) {
      console.log("inside send Data", markdown);
      onData(markdown);
    }
  };

  console.log("dataaaaaaaaaaaaaaaaaaaaa55", markdown);
  { exercisemarkdown ? sendData(exercisemarkdown) : '' }

  return (
    onData ? ' '
      :
      <div>
        <section >
          <Box >
            <article dangerouslySetInnerHTML={{ __html: markdown }}></article>
          </Box>
        </section>
      </div>
  );
}
export default MarkdownData;
