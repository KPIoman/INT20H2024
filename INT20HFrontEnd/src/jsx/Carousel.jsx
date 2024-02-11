import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/carousel.css';
import '../css/base.css'
import { Link } from 'react-router-dom';
import rightArrow from '../assets/img/rightArrow.svg'

const Carousel = ({carouselList}) => {
  const settings = {
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="container carousel-container">
        <h1 className="carousel-title">
            Нові коллекції
        </h1>
        <Slider {...settings}>
      {carouselList.map((item) => (
        <div key={item.tagId} className="carousel-item">
            <div className="carousel-poster">
              <img src={`https://artion-backend.onrender.com${item.collectionPoster}`} alt="" />
            </div>
        <Link to={`/collections/${item.tagId}`}>{item.tagName} <img src={rightArrow} alt=""/></Link>
        </div>
      ))}
    </Slider>
    </div>
    
  );
};

export default Carousel;
