import React, {useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.svg'
import chevronDown from '../assets/img/chevronDown.svg'
import search from '../assets/img/search.svg'
import filters from '../assets/img/filters.svg'

const Header = ({userInfo}) => {
    const [areCategoriesShown, setCategoriesStatus] = useState(false)
    const [searchQuery, setSearch] = useState('')

    return (
        <header>
            <div className="header-nav">
                <Link to='/' className="header-logo"><img src={logo} alt="" /></Link>
                <div className='mid-nav-part'>
                <div className='search-block'>
                    {searchQuery ? <Link className='header-search-button' to={`/search/${searchQuery}`}><img src={search} alt="" /></Link> : <button className='header-search-button' to={`/search/${searchQuery}`}><img src={search} alt="" /></button>}
                        
                    <input type="text" className='search-input' placeholder='Пошук товарів' maxLength='50' value={searchQuery} onChange={(e) => setSearch(e.target.value)}/>
                </div>
                </div>
                <div className="right-nav-part">
                    {userInfo === 0 ? <Link to='/LogIn' className='signupButton'>Вхід</Link> : <Link to='/UserAccount' className='signupButton'>Профіль</Link>}
                </div>
            </div>
        </header>
    )
}

export default Header