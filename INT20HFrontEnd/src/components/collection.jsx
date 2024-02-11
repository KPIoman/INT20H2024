import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import filter from '../assets/img/filter.svg'
import '../css/home.css';
import '../css/collection.css';
import ReactSlider from 'react-slider'
import '../css/priceSlider.css'

const Collection = ({collectionName, userInfo, tag, query}) => {
  const [fetchObj, setLotsArr] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [modifiedList, modifyList] = useState(fetchObj)
  const [filtersIsShown, showFilters] = useState(false)
  const [sortedBy, sortList] = useState('none')
  const [isSortShown, showSort] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://artion-backend.onrender.com/getLots${tag > 0? '?tag='+ tag : '?query=' + query}`);
        setLotsArr(response.data.lotsArr);
        modifyList(response.data.lotsArr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [tag]);
  
  function calculateModification() {
    setLotsArr(prevFetchObj => {
      let newArr = [];
      for (let el of prevFetchObj) {
        if (el.currentBid >= priceRange[0] && el.currentBid <= priceRange[1]) {
          newArr.push(el);
        }
      }
  
      if (sortedBy === 'price-decrease') {
        newArr.sort((a, b) => b.currentBid - a.currentBid);
      } else if (sortedBy === 'price-increase') {
        newArr.sort((a, b) => a.currentBid - b.currentBid);
      } else if (sortedBy === 'old-to-new') {
        newArr.reverse();
      }
  
      return newArr;
    });
  }

  function calculateModification() {
    let newArr = [];
  
    for (let el of fetchObj) {
      if (el.currentBid >= priceRange[0] && el.currentBid <= priceRange[1]) {
        newArr.push(el);
      }
    }
  
    if (sortedBy === 'price-decrease') {
      newArr.sort((a, b) => b.currentBid - a.currentBid);
    } else if (sortedBy === 'price-increase') {
      newArr.sort((a, b) => a.currentBid - b.currentBid);
    } else if (sortedBy === 'old-to-new') {
      newArr.reverse();
    }
  
    modifyList(newArr);
  }
  

  return (
    <>
    <h1 className='collectionTitle'>
        {collectionName}
    </h1>
    <div className='collection-filters'>
        <div className='sortBy-filter' onClick={() => {
          showSort(!isSortShown);
          showFilters(false)
        }}>
            Впорядкувати за
        </div>
        <div className={isSortShown ? 'sort-block shown' : 'sort-block'} >
            <div className={sortedBy == 'price-decrease' ? 'sort-option chosen' : 'sort-option'} onClick={() => {
              sortList('price-decrease')
              showSort(false)
              calculateModification()
              }}><span>Ціною ↓</span></div>
            <div className={sortedBy == 'price-increase' ? 'sort-option chosen' : 'sort-option'} onClick={() => {
              sortList('price-increase')
              showSort(false)
              calculateModification()
              }}><span>Ціною ↑</span></div>
            <div className={sortedBy == 'none' ? 'sort-option chosen' : 'sort-option'} onClick={() => {
              sortList('none')
              showSort(false)
              calculateModification()
              }}><span>Датою ↓</span></div>
            <div className={sortedBy == 'old-to-new' ? 'sort-option chosen' : 'sort-option'} onClick={() => {
              sortList('old-to-new')
              showSort(false)
              calculateModification()
              }}><span>Датою ↑</span></div>
        </div>
        <div className='tag-filters' onClick={() => {
          showFilters(!filtersIsShown);
          showSort(false)
        }}>
            Фільтер <span><img src={filter} alt="" /></span>
        </div>
        <div className={filtersIsShown ? 'filter-block shown' : 'filter-block'}>
                <h2 className='price-slider-h2'>
                  Ціновий діапазон
                </h2>
                <ReactSlider
                value={priceRange}
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                defaultValue={[0, 2000]}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={state => `Thumb value ${state.valueNow}`}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                max={2000}
                minDistance={1}
                onAfterChange={(value) => { 
                  setPriceRange(value)
                  calculateModification()
                }
                
              }
            />
        </div>
    </div>
    <div className="collection-sec">
       {modifiedList.map((lot) => (
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
        
      ))}
    </div>
    </>

  );
};

export default Collection;