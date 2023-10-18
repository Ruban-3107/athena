import './BrowseCourseCardView.css';
import { useEffect, useState } from 'react';
import { Span, Box, ProgressBarComponentLine } from '@athena/web-shared/ui';
import { getPercentage } from '@athena/web-shared/utils';
import { Card } from 'react-bootstrap';

export const BrowseCourseCardView = (props) => {
  const [TopicDetail, setTopicDetail] = useState();

  const { id, title, image_url, status, track, summary_data, completed_exercises, course } = props.cardContents;

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  const a =
    status == 'Published'
      ? '#62c41f'
      : status == 'Pending Approval'
        ? '#f5bf0b'
        : status == 'In Draft'
          ? '#4770d9'
          : '';

  const calculateTrack = (track) => {
    let topiccount = 0, chaptercount = 0, topicduration = 0;
    if (track?.children && track?.children?.length > 0) {
      // console.log("gggggggggg",track?.children)
      track?.children?.forEach((child) => {
        child?.track_chapters?.forEach((x) => {
          x?.chapter_topics?.forEach((y) => {
            topiccount++;
            topicduration = topicduration + Number(y.duration);
          })
          chaptercount++;
        })
      })
      const a = Math.floor(topicduration / 60);
      const b = Math.floor(topicduration % 60);
      const trackdata = { chaptercount: chaptercount, topiccount: topiccount, topichours: a, topicminutes: b };
      return trackdata;
    }
    else {
      track?.track_chapters?.forEach((x) => {
        x?.chapter_topics?.forEach((y) => {
          topiccount++;
          topicduration = topicduration + Number(y.duration);
        })
        chaptercount++;
      })
      const a = Math.floor(topicduration / 60);
      const b = Math.floor(topicduration % 60);
      const trackdata = { chaptercount: chaptercount, topiccount: topiccount, topichours: a, topicminutes: b };
      return trackdata;
    }
  }

  useEffect(() => {
    // console.log("propssssssssssssss",props)
    // if (props?.searchtrue) {
    //   console.log("uiuiuiuiuiuiui")
    //   setTopicDetail({ chaptercount: props?.cardContents?.chaplength, topiccount: props?.cardContents?.toplength, topichours: props?.cardContents?.courseDuration?.hours, topicminutes: props?.cardContents?.courseDuration?.minutes })
    // }
    // else {
    const data = calculateTrack(props.cardContents);
    setTopicDetail(data);
    // }
  }, [props.cardContents]);

  return (
    <Card
      className={`${props.cardclass ? props.cardclass : 'p-2'} h-100`}
      style={{ cursor: 'pointer', boxShadow: '0px 0px 8px #E3E3E3' }}
      onClick={props.onClick}
    >
      <Box className="d-flex align-items-center">
        {props.checkbox && (
          <div className="form-check ">
            <input
              className="form-check-input"
              disabled={props.status == 'Published' ? true : false}
              type="checkbox"
              key={id}
              id={id}
              checked={props.isChecked}
              name={title}
              onChange={props.handleClick}

            />
          </div>
        )}
        {props.status && (
          <h6
            className="mb-0 ms-auto"
            style={{ fontSize: 'smaller', color: a }}
          >
            {status}
          </h6>
        )}
      </Box>
      {
       

        <Card.Img
          variant="top"
          onClick={() => { props?.clickEvent && props?.clickEvent() }}
          src={
            image_url
              ? image_url
              : course?.image_url
                ? course?.image_url
                : 'https://miro.medium.com/max/7728/1*Ab8SnQ0cKCO7SUmTuqLKMg.jpeg'
          }
          alt="image"
          width={250}
          height={100}
          className="p-1 rounded-3"

        />

      }

      <Card.Body className="p-1">
        <Box className="d-flex align-items-center justify-content-between">
          <Card.Title
            className="mb-0 fw-bold py-1 fw-bold"
            style={{ fontSize: 'smaller' }}
          >
            {title ? toTitleCase(title) : toTitleCase(track.title)}
          </Card.Title>
          {props.myrecentCourses && (
            <p
              style={{ fontSize: 'x-small', paddingLeft: '1rem' }}
              className="text-secondary py-1"
            >
              {props.chapterlength ?? 0} Chapters
            </p>
          )}
        </Box>
      </Card.Body>
      <Card.Footer className="p-1 border-0 bg-white mt-2">
        {props.browsecourse && (
          <Box className="textbox mt-3 text-secondary">
            {/* <p className="alignleft">{props.chapterlength ?? 0} Chapters</p> */}
            <p className="alignleft">
              {TopicDetail?.chaptercount ?? 0}{' '}
              {TopicDetail?.chaptercount > 1 || TopicDetail?.chaptercount === 0
                ? 'Chapters'
                : 'Chapter'}{' '}
            </p>
            <p className="aligncenter">
              {TopicDetail?.topiccount ?? 0}{' '}
              {TopicDetail?.topiccount > 1 || TopicDetail?.topiccount === 0
                ? 'Topics'
                : 'Topic'}{' '}
            </p>
            <p className="alignright">
              {TopicDetail?.topichours ?? 0}
              {TopicDetail?.topichours > 1 ||
                TopicDetail?.topichours === 0
                ? `hrs`
                : `hr`}{' '}
              {TopicDetail?.topicminutes ?? 0}
              {TopicDetail?.topicminutes > 1 ||
                TopicDetail?.topicminutes === 0
                ? `mins`
                : `min`}
            </p>
          </Box>
        )}

        {props.myrecentCourses && (
          <Span className="progress-value-bar">
            <ProgressBarComponentLine
              progressValue={getPercentage(
                completed_exercises,
                Object.keys(summary_data?.exercises).length
              )}
            />
          </Span>
        )}
      </Card.Footer>{' '}
    </Card>
  );
}
export default BrowseCourseCardView;
