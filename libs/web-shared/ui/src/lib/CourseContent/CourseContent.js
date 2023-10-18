import './CourseContent.css';
import { Box, Span, DocumentviewIcon, VideoPlayIcon } from '@athena/web-shared/ui';
import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { apiRequest } from '@athena/web-shared/utils';

export const CourseContent = ({ chapters, viewerRef, viewButton, setPdfState, setvideoState }) => {
  const [topicdetail, setTopicDetail] = useState({});

  useEffect(() => {
    some(chapters);
  }, [chapters])


  const ContentIcon = (type) => {
    if (type == 'Video') {
      return <VideoPlayIcon />
    }
    else {
      return <DocumentviewIcon />
    }
  }

  const some = (chapters) => {
    console.log(chapters, 'test')
    let topiccount = 0;
    let topicduration = 0;
    chapters.forEach((x) => {
      x.chapter_topics.forEach((y) => {
        topiccount++;
        topicduration = topicduration + Number(y.duration);
      })
    })
    const a = Math.floor(topicduration / 60);
    const b = Math.floor(topicduration % 60);
    setTopicDetail({ topiccount: topiccount, topichours: a, topicminutes: b });
  }

  const OpenContent = async (topic) => {
    console.log(topic, 'toppp')
    var fileUrl;
    var filekey = topic.delivery_type !== "Video" ? topic?.s3_bucket_pdf_filekey : topic?.s3_bucket_filekey
    console.log(filekey,'ssss')
    if (filekey && topic.topic_type !== 'Topic Link') {
      const { value: url } = await apiRequest(`api/courses/topics/convertFileToLinkS3/${filekey}`, 'POST',null)
      fileUrl = url
      console.log(fileUrl,'fff')
    }
    if (topic.delivery_type === "Video") {
      setPdfState({ open: false });
      setvideoState({
        open: true,
        url: topic.topic_type == 'Topic Link' ? topic.topic_link : fileUrl,
        title: topic.title
      });
    }
    else {
      setvideoState({ open: false });
      setPdfState({
        open: true,
        url: fileUrl,
        title: topic.title
      });
    }
    viewerRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Box>
      <p className='count-text mt-3 mb-4'>{chapters.length} Chapters | {topicdetail.topiccount} Topics | {topicdetail.topichours} hrs {topicdetail.topicminutes} mins</p>
      <Accordion className="content-acc" alwaysOpen>
        {chapters?.sort((a, b) => (a.position > b.position ? 1 : -1)).map((chapter, i) => (
          <Accordion.Item key={chapter.id} eventKey={i} className='mb-2 accord-item ffq'>
            <Accordion.Header>
              <Box className="d-flex align-items-center justify-content-between w-100">
                <h4 className="mb-0 acc-title-cca ms-xl-2">
                  {chapter.title}
                </h4>
                <Span className="subtxt-acc">
                  <Span className="me-3">{chapter.chapter_topics.length} Topics</Span>
                  <Span className='me-xl-3'>{
                    chapter.chapter_topics?.reduce(
                      (totalDuration, topic) => {
                        const topicDuration = topic.duration;
                        let durationVal = Math.round(
                          totalDuration + Number(topicDuration)
                        );
                        return durationVal;
                      },
                      0
                    )
                  } mins</Span>
                </Span>
              </Box>
            </Accordion.Header>
            <Accordion.Body>
              {chapter?.chapter_topics?.sort((a, b) => (a.position > b.position ? 1 : -1)).map((topic, index) => (
                <Box key={topic.id} className='px-xl-3 d-flex justify-content-between'>
                  <Span className={`ms-xl-4 ${viewButton ? 'topic-under-nam' : ''}`} onClick={viewButton ? () => OpenContent(topic) : null}>
                    {ContentIcon(topic.delivery_type)}&nbsp;&nbsp;<Span className="topic-under-ind"> {index + 1}.</Span>&nbsp;<Span className='topic-under'>{topic.title}</Span>
                  </Span>
                  <Span className="topic-under-sub">
                    {topic?.topic_type} &nbsp;&nbsp;|&nbsp;&nbsp;{Math.round(topic?.duration)}mins
                  </Span>
                </Box>

              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
export default CourseContent;
