import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Collection from '../components/collection';
import '../css/home.css';
import '../css/collectionPage.css';
import '../css/collection.css';

import Header from '../components/header';
import Footer from '../components/footer';

const SearchPage = ({ userInfo }) => {
    const { query } = useParams();
    const [collectionInfo, setCollectionInfo] = useState();

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                    const response = await axios.get(`https://artion-backend.onrender.com/getLots?query=${query}`, {});
                    const collectionData = response.data;
                    setCollectionInfo(collectionData);
            } catch (error) {
                console.error('Error fetching collection details:', error);
            }
        };
    
        fetchCollection();
    }, [query]);

    return (
        <>
            <Header userInfo={userInfo}></Header>
            {collectionInfo && (
                <>
                    <div className='top-title-sec'>
                        <div className="title-overlay"></div>
                    </div>
                    <div className="container">
                        <Collection userInfo={userInfo} collectionName={`Результати пошуку: ${query}`} tag={0} query={query} ></Collection>
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

export default SearchPage;
