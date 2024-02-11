import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({userInfo}) => {
    return (
        <footer>
            <div className='site-map'>
                <ul className='footer-links'>
                    <li><Link to='/TermsAndConditions'>Угода та правила торгів </Link></li>
                    <li><Link to='/HelpCenter'>Допомога</Link></li>
                    <li><Link to='/ContactUs'>Зв'язатися з нами</Link></li>
                </ul>
                {userInfo === 0 ? 
                <div className='footer-entrance-button'>
                <Link to='/LogIn'>Увійти</Link><span>/</span>
                <Link to='/SignUp'>Реєстрація</Link>
                </div> : <div className='footer-entrance-button'><Link to='/account'>Профіль</Link></div>}
            </div>
            <div className='domen-info'>
            Copyright @ 2024 Copart Inc. All Rights Reserved
            </div>
        </footer>
    )
}
export default Footer