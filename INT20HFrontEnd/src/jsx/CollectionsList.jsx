import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/home.css';
import '../css/collectionList.css';
import '../css/collection.css';
import Header from '../components/header';
import Footer from '../components/footer';
import rightArrow from '../assets/img/rightArrow.svg'

const CollectionList = ({userInfo}) => {
    const [collectionList, setCollectionList] = useState()

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get(`https://artion-backend.onrender.com/getTags`);
                const data = response.data;
                setCollectionList(data);
            } catch (error) {
                console.error('Error fetching collection details:', error);
            }
        };
    
        fetchCollection();
    }, []);

    return (
        <>
        <Header userInfo={userInfo}></Header>
        <h1 className='collectionList-title'>
            Коллекції
        </h1>
            {collectionList && (
                <div className="container collectionList-sec">
                    {collectionList.map((el) => (
                        <Link to={`/collections/${el.tagId}`} className="collection-list-item">
                            <div className='collection-list-exact-item'>
                                <div className="collection-list-poster">
                                <img src={`https://artion-backend.onrender.com${el.collectionPoster}`} alt="" />
                                </div>
                                <h1 className='collection-list-h1'> 
                                <span>{el.tagName}</span><img src={rightArrow} alt="" />
                                </h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        <Footer userInfo={userInfo}></Footer>
        </>
    )
}
export default CollectionList
