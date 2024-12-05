import React from 'react';
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import styled from 'styled-components'
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';

const MainSlideBlock = styled.div`
  position:relative; 
  .slide {
    background-size:cover;
		background-position:center;
		background-repeat:no-repeat;
		height:221px;
    &.slide1 {
      background-image:url("./assets/image/mainbanner.jpg");	
    }
    &.slide2 {
      background-image:url("./assets/image/mainbanner.jpg");	
    }
    &.slide3 {
      background-image:url("./assets/image/mainbanner.jpg");	
    }
    .textBanner {
      padding:30px 30px 0;
      p:nth-child(1) {
        font-size:51px; color:#8c0000;
      }
      p:nth-child(2) {
        font-size:23px; color:#de7979;
        margin-top:20px; 
      }
    }
  }
  .slick-dots {
    position:absolute; bottom:20px; width:100%; text-align:center;
    li { margin:0 5px; display:inline-block;
      button { 
        width:25px; height:25px; 
        background:red; border-radius:50%;
        text-indent:-9999px; overflow:hidden; 
      }
      &.slick-active button {
        background:blue;
      }
    }
  }
  .slick-arrow {
    font-size:50px; 
		color:#f00;
		position:absolute; top:50%; margin-top:-25px;
    &.slick-prev { left:50px; z-index:9  }
    &.slick-next { right:50px; }
  }
`

const MainSlide = () => {
  
  const CustomPrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <IoIosArrowDropleftCircle
        className={className}
        onClick={onClick}
      />
    );
  };
  
  const CustomNextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <IoIosArrowDroprightCircle
        className={className}
        onClick={onClick}
      />
    );
  };

  const options = {
    dots:true,
    autoplay:true,
    autoplaySpeed:3000,
    slidesToShow:1,
    slidesToScroll:1,
    pauseOnFocus:false,
    arrows:true,
    prevArrow : <CustomPrevArrow />,
    nextArrow : <CustomNextArrow />,
    responsive : [
      { breakpoint:1024,
        settings : {
          arrows:false
        }
      }
    ]
  }

  const slideArray = [
    { firstP : "당일 배송 시작1", secondP : "오전10시 주문마감<br />오후3~6시 배송"},
    { firstP : "당일 배송 시작2", secondP : "오전10시 주문마감<br />오후3~6시 배송"},
    { firstP : "당일 배송 시작3", secondP : "오전10시 주문마감<br />오후3~6시 배송"}
  ]

  return (
    <MainSlideBlock>
      <Slider {...options}>
        {
          slideArray.map((slide, index)=>(
            <div className={`slide slide${index+1}`} key={index}>
              <div className="textBanner inner">
                <p>{slide.firstP}</p>
                <p>{slide.secondP}</p>
              </div>
            </div>
          ))
        }
      </Slider>
    </MainSlideBlock>
  );
};

export default MainSlide;