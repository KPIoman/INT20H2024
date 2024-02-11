import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "../css/home.css"
import "../css/collection.css"
import "../css/base.css"
import Header from '../components/header';
import Collection from '../components/collection';
import axios from 'axios';
import Carousel from './Carousel';
import Footer from '../components/footer';

const HomePage = ({userInfo}) => {
    const [collectionList, setCollectionList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('https://artion-backend.onrender.com/getTags');
            setCollectionList(response.data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    return (
        <>
        <Header userInfo={userInfo} mode={userInfo.token ? '' : 'signup'}></Header>
        <div className="top-title-sec">
            <div className="title-overlay">
            </div>
            <div className='title-text-container'>
                <h1>
                Discover the world of elegance and luxury!
                </h1>
                <p>
                Погляньте на нашу захоплюючу нову колекцію на аукціоні. Унікальні предмети, які розкажуть історію та додадуть шарму вашому життю.
                </p>
                <Link to="/Collections" className='collections-button'>Колекції</Link>
            </div>
        </div>
            <div class="running-wrap">
                <div class="running-string marquee">
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                </div>
                <div aria-hidden="true" class="running-string marquee">
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                <div class="run-str-item">Благодійний аукціон</div>
                </div>
            </div>
        <div className="container">
            <Collection collectionName="Останні додані лоти" userInfo={userInfo} tag={0} query={''}/>
        </div>
        <div className='checkCollection-sec'>
            <div className="checkCollection-overlay">
                <div className="container">
                    <h1 className='checkCollection-h1'>
                    Відчуйте чари минулого! Огляньте нашу вражаючу колекцію антикваріату на аукціоні.
                    </h1>
                    <Link to="/Collections" className='collections-button'>Колекції</Link>
                </div>
            </div> 
        </div>
        <Carousel carouselList = {collectionList}></Carousel>
        <Footer userInfo={userInfo}></Footer>
        </>
    )
}

export default HomePage