import { Box, Grid, Typography, Button, Card, CardContent, CardActions, CardMedia, Rating, Avatar, IconButton, AccordionSummary, Accordion, AccordionDetails, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Texts from '../Components/InputItems/Texts';
import bgImage from '../Images/hp4.webp';
import easyBookking from '../Images/easy booking.jpg';
import payment from '../Images/payment.jpg';
import location from '../Images/location2.jpeg';
import qr from '../Images/qr.png';
import TestimonialsSection from '../Components/Testimonials/Testimonials';
import {stringAvatar } from '../Components/Avatar/Avatar';
import FeedbackForm from '../Components/DialogBox/FeedbackForm';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GetRequest, GetResponse } from '../APIs/NodeBackend';
import { ToastAlert } from '../Components/MyNotifications/WindowAlerts';
import { useNavigate } from 'react-router-dom';
import { ViewZoomIn, ViewFlyInY } from '../Components/Animations/Entrance.View';
import { ViewFadeIn } from '../Components/Animations/Entrance.View';
import { ViewFlyInX } from '../Components/Animations/Entrance.View';

const QNA = [{
  "que": "Suspendisse accumsan tortor quis turpis.",
  "ans": `Curabitur in libero ut massa volutpat convallis. elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.`
}, {
  "que": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
  "ans": "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est."
}, {
  "que": "Donec dapibus.",
  "ans": "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus."
}, {
  "que": "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
  "ans": "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus."
}, {
  "que": "Proin at turpis a pede posuere nonummy. Integer non velit.",
  "ans": "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl."
}, {
  "que": "Sed sagittis.",
  "ans": "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi."
}, {
  "que": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
  "ans": "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo."
}, {
  "que": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
  "ans": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl."
}, {
  "que": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.",
  "ans": "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.\n\nIn congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus."
}, {
  "que": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
  "ans": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum."
}]

const APP_URL = 'https://econductornew.pages.dev/';

function FeedbackCard({loaded, feedback}){
  return(
    <ViewZoomIn duration={1000} sx={{ height:'100%', width:'100%', display:'flex', justifyContent:'space-around'}}>
      <Card elevation={3} sx={{ height:'100%', width:'100%', padding:'20px', display:'flex', flexDirection:'column', alignItems:'start', maxWidth:'400px', justifyContent:'space-between', gap:'10px'}}>
        {loaded ? 
          <Rating value={feedback.rating} precision={1} readOnly />
        : 
          <Skeleton animation="wave" variant="rounded" width={200} height={16}/>
        }
        
        <Box height={'calc(100% - 80px)'} width={'100%'}>
          {loaded ? 
            <Texts variant={'body2'} fontWeight='normal' whiteSpace='pre-line' textAlign={'justify'}>
              {feedback.note}
            </Texts>  
          : 
            <Skeleton animation="wave" variant="rounded" width={'100%'} height={200}/>
          }
        </Box>
        <Box width={'100%'} display={'flex'} alignItems={'center'}>
          {loaded ? 
            <Avatar {...stringAvatar(feedback.name)}/>
          :
            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
          }
          <Box height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} ml={2}>
            {loaded ? 
              <Texts fontSize='17px'>{feedback.name}</Texts>
            : 
              <Skeleton animation="wave" variant="rounded" width={150} height={20}/>
            }

            {loaded ? 
              <Texts variant={'subtitle1'} fontColor='textSecondary'>{feedback.userType}</Texts>
            : 
              <Skeleton animation="wave" variant="rounded" width={100} height={15}/>
            }
            
          </Box>
        </Box>
      </Card>
    </ViewZoomIn>
  );
};

function AccordionPack({head, body}){
  return(
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
      >
        <Texts variant={'body1'} whiteSpace='pre-wrap' >{head}</Texts>
      </AccordionSummary>
      <AccordionDetails>
        <Texts whiteSpace='pre-wrap' variant={'body2'} fontColor='textSecondary'>{body}</Texts>
      </AccordionDetails>
    </Accordion>
  );
}

export default function Home({setLoading, language}) {
  const navigate = useNavigate();

  // Variable to hold the active step
  const [activeStep, setActiveStep] = useState(0);
    
  // Variable to hold the feedback form state
  const [open, setOpen] = useState(false);

  // Variable to hold the feedbacks
  const [feedbacks, setFeedbacks] = useState({
    loaded: false,
    data: [],
  });

  // Getting feedbacks
  useEffect(()=>{
    const getFeedbacks = async() => {
      try {
        setLoading(true);  // Enabling spinner
        const serverRespose = await GetResponse('feedback/get');
        console.log('Feedbacks: ', serverRespose.data);
        setFeedbacks({loaded:true, data:serverRespose.data});
      } catch (error) {
        console.log('error in fetching feedbacks');
      } finally {
        setLoading(false);  // Disabling spinner
      }
    }

   getFeedbacks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handling open form
  const handleOpen = () => {
    console.log('Feedback form is trying to open');
    if(!sessionStorage.getItem('isLogged')){
      setOpen(false);
      navigate('/signin');
    } else {
      setOpen(true);
    }
  }

  // Handling close button
  const handleClose = () => {
    console.log('Feedback form is closed');
    setOpen(false);
  }

  // Handling feedback submit
  const handleSubmit = (feedback) => {
    console.log('Feedback form is Submit', feedback);
    submitFeedback(feedback);
    setOpen(false);
  }

  // Quick navigations
  const handleButtons = (path) => {
    console.log('Ready to navigate: ', path);
    navigate(`/${path}`);
  }

  // Refresh page
  const refresh = (timmer=3000) => {
    setTimeout(() => {
      navigate(0);
    }, timmer+1);
  }
  
  // API to submit feedback
  const submitFeedback = async(msg) => {
    try {
      setLoading(true);  // Enabling spinner
      const serverRespose = await GetRequest(msg, 'feedback/new');
      console.log('Submit state: ', serverRespose.data);
      setLoading(false);  // Disabling spinner
      if (serverRespose.data === 'success'){
        ToastAlert({
          type: 'success',
          title: 'Thanks for your feedback!',
          onClose: refresh
        });
      }
    } catch (error) {
      console.log('Error in submitting feedback')
    }
  }

  return (
    <Box width="100%" height="auto" display={'flex'} flexDirection={'column'} alignItems={'center'} bgcolor={'ghostwhite'}>
      
      {/* Hero Section */}
      <Box width={'100%'} 
        sx={{
          height:'calc(100vh - 100px)',
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundSize: 'cover',
          display:'flex',
          justifyContent:'start' ,
          alignItems:'center',
          padding:'5%',
          '@media (max-width: 600px)': {
            height: 'auto', 
            aspectRatio: '16/9',
            backgroundSize: 'contain', 
            padding:'0',
            justifyContent:'center',
          },
        }}
      >
        <ViewZoomIn duration={1500}>
          <Box 
            sx={{
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              pr:'5%',
              '@media (max-width: 600px)': {
                padding: '10px', // Adjust padding for smaller screens
              },
            }}
          >
            <Typography 
              variant='h1' 
              fontWeight={'bold'}
              color={'black'}
              whiteSpace={'nowrap'}
              sx={{
                fontSize: '2rem', // Default font size
                '@media (min-width: 600px)': {
                  fontSize: '3rem', // Adjust font size for larger screens
                },
                '@media (min-width: 960px)': {
                  fontSize: '4rem', // Adjust font size for even larger screens
                },
              }}
            >
              Welcome to e-conductor
            </Typography>  

            <Typography 
              variant='body2'
              fontWeight={'bold'} 
              color={'textSecondary'}
              sx={{
                fontSize: '1rem', // Default font size
                '@media (min-width: 600px)': {
                  fontSize: '1.7rem', // Adjust font size for larger screens
                },
              }}
            >
              Your Smart Bus Ticket Booking Solution
            </Typography>  

            <Button variant="contained" color="primary" size="large" sx={{mt:'10px'}} onClick={()=>handleButtons('booking')}>
              Buy Your Ticket
            </Button>     
          </Box>
        </ViewZoomIn>
      </Box>

      {/* Features Section */}
      <Box width="100%" p={'60px 30px'}>
        <Texts variant="h4" textAlign="center" mb={4}>Our Features</Texts>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <ViewFlyInY direction={'bottom'} >
              <Card elevation={3} sx={{ height: '100%', display:'flex', flexDirection:'column', alignItems:'center', maxWidth:'400px', justifyContent:'space-between'}}>
                <CardMedia
                  sx={{ width:'100%', aspectRatio:'3/2' }}
                  image={easyBookking}
                />
                <CardContent sx={{display:'flex', flexDirection:'column', gap:'10px' }}>
                  <Texts textAlign={'center'} variant="h6">Easy Booking</Texts>
                  <Texts textAlign={'justify'} variant="body2" whiteSpace='normal' fontColor='textSecondary'>
                    Experience a hassle-free ticket booking process with our user-friendly platform. Quickly find and reserve your seat on any bus, anytime, with just a few clicks. No more waiting in lines-book your journey from the comfort of your home.
                  </Texts>
                </CardContent>
                <CardActions sx={{mb:1}}>
                  <Button size="small" variant='outlined' onClick={()=>handleButtons('booking')}>Book Now</Button>
                </CardActions>
              </Card>
            </ViewFlyInY>
          </Grid>

          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <ViewFlyInY direction={'bottom'} delay={100}>
              <Card elevation={3} sx={{ height: '100%', display:'flex', flexDirection:'column', alignItems:'center', maxWidth:'400px', justifyContent:'space-between'}}>
                <CardMedia
                  sx={{ width:'100%', aspectRatio:'3/2' }}
                  image={payment}
                />
                <CardContent sx={{display:'flex', flexDirection:'column', gap:'10px' }}>
                  <Texts textAlign={'center'} variant="h6">Secure Payment</Texts>
                  <Texts textAlign={'justify'} variant="body2" whiteSpace='normal' fontColor='textSecondary'>
                    Your financial security is our top priority. We offer multiple secure payment options, ensuring your transactions are protected with the latest encryption technology. Enjoy peace of mind as you book your tickets safely and securely.
                  </Texts>
                </CardContent>
                <CardActions sx={{mb:1}}>
                  <Button size="small" variant='outlined' onClick={()=>handleButtons('reload')}>Reload Now</Button>
                </CardActions>
              </Card>
            </ViewFlyInY>
          </Grid>

          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <ViewFlyInY direction={'bottom'} delay={200}>
              <Card elevation={3} sx={{ height: '100%', display:'flex', flexDirection:'column', alignItems:'center', maxWidth:'400px', justifyContent:'space-between'}}>
                <CardMedia
                  sx={{ width:'100%', aspectRatio:'3/2' }}
                  image={location}
                />
                <CardContent sx={{display:'flex', flexDirection:'column', gap:'10px' }}>
                  <Texts textAlign={'center'} variant="h6">Real-time Tracking</Texts>
                  <Texts textAlign={'justify'} variant="body2" whiteSpace='normal' fontColor='textSecondary'>
                    Stay informed with real-time bus tracking. Know the exact location of your bus and receive timely updates on its arrival. Our live tracking feature helps you plan your journey better, ensuring you’re never left waiting.
                  </Texts>
                </CardContent>
                <CardActions sx={{mb:1}}>
                  <Button size="small" variant='outlined' onClick={()=>handleButtons('avtickets')}>Track Now</Button>
                </CardActions>
              </Card>
            </ViewFlyInY>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}      
      <Box width="100%" p={'10px 30px'}>
        <Texts variant="h4" textAlign="center" mb={4}>Happy Customers</Texts>
        <Grid container spacing={3} justifyContent={'center'}>
          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <FeedbackCard
              loaded={feedbacks.loaded}
              feedback={feedbacks.data[activeStep]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <FeedbackCard
              loaded={feedbacks.loaded}
              feedback={feedbacks.data[activeStep+1]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} justifyContent={'center'} display={'flex'}>
            <FeedbackCard
              loaded={feedbacks.loaded}
              feedback={feedbacks.data[activeStep+2]}
            />
          </Grid>
        </Grid>     
      </Box>
      <TestimonialsSection activeStep={activeStep} setActiveStep={setActiveStep}/>
      <Button variant='outlined' onClick={handleOpen}>Leave a Review</Button>
      <FeedbackForm open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
      
      {/* FAQ Section */}
      <Box width="100%" padding={'60px 30px'}>
        <Texts whiteSpace='normal' variant="h4" textAlign="center" mb={4}>Frequently Asked Questions</Texts>
        <ViewFadeIn duration={2000} sx={{padding:2}}>
          {QNA.map((item, index) => 
            <AccordionPack key={index} head={item.que} body={item.ans}/>
          )}
        </ViewFadeIn>
      </Box>
      
      {/* Mobile App */}
      <Box width="100%" padding={'10px'}>
        <Texts variant="h4" textAlign="center" mb={4}>Do More in the App</Texts>
        <ViewFlyInX >
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display:"flex", justifyContent:'space-around'}}>
            <Card elevation={3} sx={{width:{xs:'calc(100% - 10px)', md:'500px'}, padding:'20px', display:'flex', justifyContent:'space-around', alignItems:'center'}}>
              <CardMedia
                sx={{ minWidth:'100px', minHeight:'100px', mr:'20px'}}
                image={qr}
              />
              <Box>
                <Texts variant={'h6'} whiteSpace='normal'>
                  Download the <span style={{ whiteSpace: 'nowrap' }}>e-conductor</span> app
                </Texts>
                <Texts variant={'body2'} fontColor='textSecondary'>
                  Scan to download
                </Texts>
              </Box>
              <IconButton sx={{height:'40px', width:'40px'}}>
                <ArrowForwardIcon/>
              </IconButton>
            </Card>
          </a>
        </ViewFlyInX>
      </Box>
    </Box>
  );
}
