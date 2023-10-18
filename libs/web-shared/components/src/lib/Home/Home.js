
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import './Home.css';
import { Box, GroupBox, IntuitiveIcon } from '@athena/web-shared/ui';

const datas = [
  {
    title: "Hands-on-Lab",
    subtitle: "Provides access to real-world technology enabling them to gain practical skills guided by experienced instructors"
  },
  {
    title: "Customized Cohorts",
    subtitle: "Designed to offer a blended learning approach, combining online learning with in -person or virtual classroom sessions."
  },
  {
    title: "Intuitive Delivery",
    subtitle: "Optimized to make the learning experience engaging and interactive."
  },
];

const differentiators = [
  {
    id: 1,
    img: "assets/images/talking-audience 2.png",
    content: "Expert- led Courses"
  },
  {
    id: 2,
    img: "assets/images/team-leader.png",
    content: "Personalised Learning"
  },
  {
    id: 3,
    img: "assets/images/smiling.png",
    content: "Career Development Tools"
  },
  {
    id: 4,
    img: "assets/images/pretty.png",
    content: "Flexible & accessible, Learning Experience"
  }
]

const coursedata = [
  {
    image: "assets/images/homecourse5.png",
    title: "Basic figma",
    cost: "120",
    content: ["Professional Certificate", "Free Mockups", "Free Design Kit"]
  },
  {
    image: "assets/images/homecourse1.png",
    title: "Advance Figma",
    cost: "180",
    content: ["Professional Certificate", "1000+ Case Study & Mockups", "Free Design Kit"]
  },
  {
    image: "assets/images/homecourse2.png",
    title: "Basic UI/UX Course",
    cost: "220",
    content: ["Professional Certificate", "1000+ Case Study & Mockups", "Free Design Kit"]
  },
  {
    image: "assets/images/homecourse3.png",
    title: "Advance Web Design",
    cost: "120",
    content: ["Professional Certificate", "1000+ Case Study & Mockups", "Free Design Kit"]
  },
  {
    image: "assets/images/homecourse4.png",
    title: "Basic figma",
    cost: "120",
    content: ["Professional Certificate", "Free Mockups", "Free Design Kit"]
  }
]
export const Home = () => {
  return (
    <div className="position-relative landing-page">
      <section className="position-relative py-0" style={{ backgroundColor: '#F9F9F9' }}>
        <Container fluid>
          <Row className="pl-xl-3">
            <Col lg={6} className='p-3'>
              <Box className=" ms-xl-2 pl-xl-5 pt-xl-5">
                <h1 className="hero-txt">
                  Learning Meets Limitless Opportunities
                </h1>
                <p className='hero-sub mt-4 '>A cognitive talent experience platform to unlock your <br />potential, and accelerate your tech career. </p>
              </Box>
            </Col>
            <Col lg={6} className='pt-3 px-3'>
              <Box className="pl-xl-4 pr-xl-1 mt-5">
                <img src="assets/images/herogirl-image.png" className='w-100 h-100 pl-xl-4' />
              </Box>
            </Col>
          </Row>
        </Container>
        <Box className="card-over">
          <Card className="card11 pr-5">
            <Box className="d-flex align-items-center">
              <Box className="py-2" style={{ backgroundColor: '#B17CFA' }}>
                <img src="assets/images/bookicon.png" className='' width="80px" height="70px" />
              </Box>
              <Box className='px-4'>
                Top Notch Mentors &<br /> High Quality Content
              </Box>
            </Box>
          </Card>
        </Box>
        <Box className='card-over-2'>
          <Card className="card11 pr-1">
            <Box className="d-flex align-items-center">
              <Box className="py-1" style={{ backgroundColor: '#45BCD7' }}>
                <img src="assets/images/archer.png" className='p-1' width="80px" height="70px" />
              </Box>
              <Box className='ms-xl-1 pl-2 pr-3'>
                Customized Learning Plans &<br />
                Continuous Career Guidance
              </Box>
            </Box>
          </Card>
        </Box>
      </section >

      <section style={{ backgroundColor: '#CCE8FF36' }}>
        <Container fluid>
          <Row className='px-xl-4 py-5 g-3'>
            {datas.map((dat, index) => (
              <Col xl={4} md={6} sm={12} >
                <Box className='d-flex gap-4 ms-xl-4'>
                  <Box>{index == 1 ? <IntuitiveIcon /> : <GroupBox />}</Box>
                  <Box><h5 className='sub-hero-head'>{dat.title} </h5>
                    <p className='descrip-txt'>{dat.subtitle}</p>
                  </Box>
                </Box>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className='position-relative'>
        <Container fluid>
          <Row className='px-xl-4 py-5 g-3 d-flex justify-content-between row'>
            <Col lg={5} className='p-xl-5'>
              <img src="assets/images/people-learn.png" className='w-100 ms-xl-2' />
            </Col>
            <Col lg={5} className='pr-xl-5 py-4 pl-xl-0'>
              <Box>
                <h1 className='list-title-hom'>Why we are the best
                  in the Industry</h1>
                <ul className='home-list mt-4'>
                  <li>Expert-led courses taught by industry experts with real-world experience, ensuring that you receive the most up-to-date and relevant knowledge.</li>
                  <li>Designed to adapt to your unique learning style and pace, providing personalized learning experiences tailored to your needs.</li>
                  <li>Offering powerful tools for career development, including personalized career road map, and career mentoring services</li>
                  <li>Accessible from anywhere, at any time allowing you to learn at your own pace and on your own schedule, making it easy to fit learning into your busy lifestyle.</li>
                </ul>
                <Button variant="dark" className='py-3 px-5 rounded-5 mt-4'> Start Learning</Button>
              </Box>
            </Col>
          </Row>
        </Container>
        <Box className="card-over-4">
          <Card className="card-15">
            <Card.Title className='text-center mt-4 diff-title'>Our Differentiators</Card.Title>
            <ul>
              {differentiators.map((data) => (
                <li key={data.id} className='d-flex align-items-center py-2 px-4 diff-hover'>
                  <img src={data.img} className='' />
                  <h6 className='ms-3'>{data.content}</h6>
                </li>
              ))}
            </ul>
          </Card>
        </Box>
      </section>

      <section className="px-5 py-5 g-3">
        <h1 className='explore-cou mb-5 ms-xl-4'>Explore our Courses</h1>
        <Row xl={5} lg={4} md={3} sm={2} xs={1} className='px-xl-3 g-4 mb-xl-5'>
          {coursedata.map((dat) => (
            <Col>
              <Card className='rounded-3 shadow-sm'>
                <Box>
                  <img src={dat.image} style={{ borderRadius: "25px" }} className='w-100 p-3' />
                </Box>
                <Card.Body className='py-0'>
                  <Box className='d-flex align-items-center justify-content-between'>
                    <h6 className='card-home-ti'>{dat.title}</h6>
                    <h6 className="card-home-ti me-2">${dat.cost}</h6>
                  </Box>
                  <ul className='card-cou-li'>
                    {dat.content.map(list =>
                      <li>{list}</li>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="py-5 sub-foot-sec">
        <Row className="px-xl-4">
          <Col lg={5} className='pr-0'>
            <img src='assets/images/lap-girl.png' className='w-100' />
          </Col>
          <Col lg={7}>
            <Box className="mt-xl-4">
              <h1 className='sub-foot-head mb-5'>Revolutionizing Skilling Landscape</h1>
              <ul className='sub-foot-list'>
                <li>Lifetime Value creation</li>
                <li>Customized Insights & Career Roadmaps</li>
                <li>Continuous Career Guidance</li>
              </ul>
            </Box>
          </Col>
        </Row>
      </section>

      <section className='px-xl-5'>
        <Container className='px-xl-5 py-5'>
          <h1 className='text-center last-card-head px-xl-5 mt-xl-3'>Shaping the Future of Technology Learning
            and Career Development</h1>
          <Row xl={3} lg={3} md={2} sm={1} className='px-xl-4 mt-5 mb-5'>
            {[1, 2, 3].map((data, index) =>
              <Col>
                <Card className='foot-card'>
                  <Box className='mt-2'>
                    <h5 className="text-center mt-4 mb-0 foot-card-title">{index == 0 ? 'Mentors' : index == 1 ? 'Learners' : 'Enterprises'}</h5>
                    <img src={`assets/images/${index == 0 ? 'footcard3.png' : index == 1 ? 'footcard2.png' : 'footcard1.png'}`} className='w-100 p-3' />
                  </Box>
                  <Card.Body>
                    <ul className='foot-list'>
                      <li> Intuitive and easy to use Knowledge sharing experience.</li>
                      <li>  Flexible work Schedule</li>
                      <li> Competitive Compensation</li>
                      <li> Professional Development</li>
                      <li>  Networking Opportunities</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Box className='meta-overlay'>
        <img src="assets/images/meta-overlay (1).png" className='over-hero' />
      </Box>
    </div>
  );
}
export default Home;
