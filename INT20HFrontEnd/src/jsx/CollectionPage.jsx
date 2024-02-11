import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Collection from '../components/collection';
import '../css/home.css';
import '../css/collectionPage.css';
import '../css/collection.css';

import Header from '../components/header';
import Footer from '../components/footer';

const CollectionPage = ({ userInfo }) => {
    const { collectionId } = useParams();
    const [collectionInfo, setCollectionInfo] = useState();
    const nameList = ["Дзеркала", "Рукописи", "Монети", "Картини", "Одяг", "Платівки", "Посуд", "Фотографії", "Іграшки"]

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get(`https://artion-backend.onrender.com/getLots?tag=${collectionId}`);
                const collectionData = response.data;
                setCollectionInfo(collectionData);
            } catch (error) {
                console.error('Error fetching collection details:', error);
            }
        };
    
        fetchCollection();
    }, [collectionId]);
    
    console.log(nameList[Number(collectionId) - 1]);

    return (
        <>
            <Header userInfo={userInfo}></Header>
            {collectionInfo && (
                <>
                    <div className='collection-top-poster'>
                        <img src={`https://artion-backend.onrender.com${collectionInfo.thumbnail}`} alt="" />
                    </div>
                    <div className="container">
                        <Collection userInfo={userInfo} collectionName={nameList[Number(collectionId) - 1]} tag={collectionId} query={''}></Collection>
                    </div>
                    <div className='checkCollection-sec collectionPage'>
                    <div className="checkCollection-overlay">
                        <div className="container">
                            <h1 className='checkCollection-h1'>
                            Відчуйте чари минулого! Огляньте нашу вражаючу колекцію антикваріату на аукціоні.
                            </h1>
                            <Link to="/Collections" className='collections-button'>Колекції</Link>
                        </div>
                    </div> 
                </div>
                </>
            )}
            <Footer userInfo={userInfo}></Footer>
        </>
    );
};

export default CollectionPage;
