import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import "../css/home.css";
import "../css/lot.css";
import "../css/base.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import nextArrow from '../assets/img/next-arrow.svg';
import prevArrow from '../assets/img/prev-arrow.svg';
import rightArrow from '../assets/img/rightArrow.svg';
import sendComment from '../assets/img/sendComment.svg';
import bottomChevron from '../assets/img/bottom-chevron.svg'

const Lot = ({ userInfo }) => {
    const { lotId } = useParams();
    const [lotInfo, setLot] = useState({});
    const [imgLinks, setImgLinks] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [similarItems, setSimilarItems] = useState()
    const [comment, writeComment] = useState('')
    const [usersPopUp, setUserPopUp] = useState(false)

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        focusOnSelect: true,
        nextArrow: <img src={nextArrow} alt="Next" className="arrow-img" />,
        prevArrow: <img src={prevArrow} alt="Previous" className="arrow-img" />,
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

    useEffect(() => {
        const fetchLotDetails = async () => {
            try {
                const response = await axios.get(`https://artion-backend.onrender.com/getLotInfo?lotId=${lotId}`);
                const lotData = response.data;
    
                setLot(lotData);
    
                const updatedImgLinks = [lotData.thumbnail];
    
                if (lotData.img.length !== 0) {
                    for (const el of lotData.img) {
                        updatedImgLinks.push(el.url);
                    }
                }
    
                setImgLinks(updatedImgLinks);
    
                // Convert string date to JavaScript Date object
                const targetDate = new Date(lotData.expirationDate).getTime();
    
                const updateRemainingTime = () => {
                    const currentDate = new Date().getTime();
                    const timeDifference = targetDate - currentDate;
    
                    if (timeDifference > 0) {
                        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
                        setTimeRemaining(`${days} ${days === 1 ? 'день' : days > 4 ? 'днів' : 'дні'} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10? `0${seconds}` : seconds}`);
                    } else {
                        setTimeRemaining('Аукціон завершено');
                    }
                };
    
                // Update the time remaining every second
                const intervalId = setInterval(updateRemainingTime, 1000);
    
                // Call it once immediately to set the initial value
                updateRemainingTime();
    
                // Clean up the interval on component unmount
                return () => clearInterval(intervalId);
            } catch (error) {
                console.error('Error fetching lot details:', error);
            }
        };
    
        const fetchSimilarLots = async () => {
            try {
                const response = await axios.get(`https://artion-backend.onrender.com/getTags`);
                const lotData = response.data;
                let currentCollection = lotData.find(el => el.tagName === lotInfo.tag);
    
                if (currentCollection) {
                    const newResponse = await axios.get(`https://artion-backend.onrender.com/getLots?tag=${currentCollection.tagId}&quantity=5`);
                    setSimilarItems(newResponse.data.lotsArr);
                    console.log(similarItems);
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
    
        fetchLotDetails();
        fetchSimilarLots();
    }, [lotId, lotInfo.tag]);
    
    async function handleSendComment() {
        if (userInfo != 0 && comment.length > 0) {
            try {
                const response = await axios.post('https://artion-backend.onrender.com/comment', {lotId: lotId, comment: comment})
                window.page.reload()
            } catch (error) {
                console.error('Error creating a comment:', error);
            }

        }
    }

    const formatDate = (createdAt) => {
        const [year, month, day] = createdAt.split('-');
        return `${day}.${month}.${year}`;
      };

    return (
        <>
            <Header userInfo={userInfo}></Header>
            <div className="container main-lot-sec">
                <div className='links-way'>
                    <Link to='/'>Головна сторінка</Link><span>/</span>
                    <h3 className='lot-upper-title'>
                        {lotInfo.mainName}
                    </h3>
                </div>
                <div className='lot-main-info'>
                    <div className='lot-carousel-overlay'>
                        {imgLinks.length > 1 ? (
                            <Slider {...settings}>
                                {imgLinks.map((lot, index) => (
                                    <div key={index} className="lot-carousel-poster">
                                        <img src={`https://artion-backend.onrender.com${lot}`} alt="" />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className='main-info-poster'>
                                <img src={`https://artion-backend.onrender.com${lotInfo.thumbnail}`} alt="" />
                            </div>
                        )}
                    </div>
                    <div className="lot-main-text-info">
                        <div className="text-upper-part">
                            <h1 className='lot-info-mainName'>
                                {lotInfo.mainName}
                            </h1>
                            <h4 className="lot-info-sellerName">
                                {lotInfo.sellerName}
                            </h4>
                            <div className='lot-info-numbers-info'>
                                <div className='numbers-info-text'>
                                    <h2>
                                        Час до завершення:
                                    </h2>
                                    <h2>
                                        Поточна ставка:
                                    </h2>
                                    <h2>
                                        Кількість ставок:
                                    </h2>
                                </div>
                                <div className="numbers-info-numbers">
                                    <h2>
                                        {timeRemaining}
                                    </h2>
                                    <h2>
                                        {lotInfo.actualPrice === null ? lotInfo.startPrice : lotInfo.actualPrice}$
                                    </h2>
                                    <h2>
                                        {lotInfo.activeUsers?.length ?? 'No active users'}{lotInfo.activeUsers? <img src={bottomChevron} alt="" className={usersPopUp ? 'popUp-chevron shown' : 'popUp-chevron'  } onClick={() => setUserPopUp(!usersPopUp)}/> : ''}
                                    </h2>
                                </div>
                                {lotInfo.activeUsers ?
                                <div className={usersPopUp ? 'active-users-popUp shown' : 'active-users-popUp'}>
                                    <div className="usersPopUpNav">
                                        <h5 className='navItem usersPopUpUser'>
                                            Учасник
                                        </h5>
                                        <h5 className="navItem usersPopUpBid">
                                            Ставка
                                        </h5>
                                    </div>
                                    <div className='usersPopUpList'>
                                        {lotInfo.activeUsers.map((el, index) => (
                                            <div className='usersPopUpItem'>
                                                <div className='usersItem usersPopUpUser'>
                                                    <span className='orderNumber'>{index + 1}</span>
                                                    <div className='popUp-avatar'>
                                                        {el.userAvatar != null ? <img src={`https://artion-backend.onrender.com${el.userAvatar}`} alt="" /> : ''}                                                
                                                    </div>
                                                    <h5 className='popUp-userName'>
                                                        {el.userName}
                                                    </h5>
                                                </div>
                                                <div className='popUpListBid usersPopUpBid'>
                                                    {el.bid}$
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div> : ''}
                            </div>
                            <div className="lot-info-seller-sec">
                                <h3>
                                    Продавець
                                </h3>
                                <div className='info-seller-block'>
                                    <div className='seller-info-picture-plus-name'>
                                        <div className="seller-info-pp">
                                            {lotInfo.sellerPhoto ? <img src={`https://artion-backend.onrender.com${lotInfo.sellerPhoto}`} /> : ''}
                                        </div>
                                        <h4>{lotInfo.sellerName}</h4>
                                    </div>
                                    <div className="moreUserInfo-a">
                                        <Link to='/'>Дізнатися більше</Link><Link to='/'><img src={rightArrow} alt="" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {userInfo === 0 ? 
                        <Link to='/LogIn' className='make-a-bid-info-link'>Зробити ставку</Link> : 
                        <div className='make-a-bid-info-button'>
                            Зробити ставку
                        </div>}
                    </div>
                </div>
                    <h1 className='lot-section-name'>
                        Опис
                    </h1>
                    <p className='lot-description'>
                        {lotInfo.description}
                    </p>
                    <h1 className='lot-section-name'>
                        Схожі лоти
                    </h1>
                    <div className='similar-lots-list'>
                    {similarItems && similarItems.map((lot) => {
                        if (lot.lotId != lotId) {

                            return (
                                <Link key={lot.lotId} className='collection-item' to={`/lot/${lot.lotId}`}>
                                    <div className='collection-item-img-overlay'>
                                    <img src={lot.thumbnail ? "https://artion-backend.onrender.com" + lot.thumbnail : '/src/assets/img/noPhoto.jpg'} alt="" />
                                    </div>
                                    <h2 className='mainName'>
                                        {lot.mainName}
                                    </h2>
                                    <h3 className='sellerName'>
                                        {lot.sellerName}
                                    </h3>
                                    <div className='currentBid'>
                                        <span>
                                            Поточна ставка
                                        </span>
                                        <span>
                                            {lot.currentBid == null ? '0' : `${lot.currentBid}`}$
                                        </span>
                                    </div>
                                        <Link  className='makeBid-button' to={userInfo.token ? `/lots/${lot.lotId}`: '/SignUp'}>Зробити ставку</Link>
                                </Link>
                            );
                        }
                        return null;
                    })}
                    </div>
                    <h1 className='lot-section-name'>
                        Коментарі <span>{`(${lotInfo.comments && lotInfo.comments.length ? lotInfo.comments.length : '0'})`}</span>
                    </h1>
                    <div className='comment-input-sec'>
                        <div className={userInfo === 0 ? 'comments-overlay enable' : 'comments-overlay'}>
                            <Link to='/LogIn'>Увійдіть до профілю, щоб додавати коментарі</Link>
                        </div>
                        <button className={comment.length ? 'comment-enter-button enable' : 'comment-enter-button'} onClick={() => handleSendComment()}>
                            <img src={sendComment} alt="" />
                        </button>
                        <input type="text" className='comment-input' placeholder='Додайте коментар...' maxLength='400' value={comment} onChange={(e) => writeComment(e.target.value)}/>
                    </div>
                    <div className='comments-list-section'>
                        {lotInfo.comments && lotInfo.comments.length ? 
                        lotInfo.comments.map((el) => (
                            <div className='comment'>
                            <div className='comment-upper'>
                                <div className='comment-avatar'>
                                    {el.userAvatar != null ? <img src={`https://artion-backend.onrender.com${el.userAvatar}`} alt="" /> : ''}
                                </div>
                                <h5 className='comment-userName'>
                                    {el.userName}
                                </h5>
                                <h5 className='comment-date'>
                                    {formatDate(el.createdAt)}
                                </h5>
                            </div>
                            <p className='comment-content'>
                                {el.comment}
                            </p>
                        </div>
                        )) : ''}
                    </div>
            </div>
            <Footer userInfo={userInfo}></Footer>
        </>
    );
}

export default Lot;
