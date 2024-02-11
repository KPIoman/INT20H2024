import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import eyeShown from '../assets/img/eyeshown.svg'
import eyeHidden from '../assets/img/eyehidden.svg'
import '../css/entrance.css'
import axios from 'axios'


function SignUpComponent({userInfo}) {
    const [userFirst, setUserFirst] = useState('');
    const [userLast, setUserLast] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('')
    const [password, setPassword] = useState('');
    const [secondPassword, repeatPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('')
    const [passwordShown, showPassword] = useState(false)
    const [secondShown, showSecondPassword] = useState(false)
    const navigate = useNavigate()
    const [agrAccepted, acceptAgreement] = useState(false)
    const firstStep = document.querySelector('.first-step')
    const secondStep = document.querySelector('.second-step')

    function checkTheEmail() {
        const entranceInput = document.querySelector('.entranceEmail')
        if (email.length && !email.includes('@gmail.com')) {
            setEmailStatus('Вказано некоректну пошту')
            entranceInput.style.border = '2px solid rgba(218, 36, 36, 1)'
            return false
        }
        else {
            setEmailStatus('')
            entranceInput.style.border = '2px solid #F0F0F0'
            return true
        }
    }

    function checkThePassword() {
        const passwordRepeat = document.querySelector('.passwordRepeat')
        if (password != secondPassword) {
            setPasswordStatus('Паролі не співпадають')
            passwordRepeat.style.border = '2px solid rgba(218, 36, 36, 1)'
            return false
        } else {
            setPasswordStatus('')
            passwordRepeat.style.border = '2px solid #F0F0F0'
            return true
        }
    }
    
    function handleGoAhead() {
        if (checkTheEmail() && checkThePassword()) {
            firstStep.style.display = 'none'
            secondStep.style.display = 'flex'
        }
    }

    async function handleSignUp() {
        if (userFirst.length && userLast.length && agrAccepted) {
            let sendObj = {
                username: userFirst + ' ' + userLast,
                password: password,
                email: email
            }
            await axios.post('https://artion-backend.onrender.com/register', sendObj).then(res => console.log(res.data))
        }
    }

    return (
        <>
        <div className="entrance-background">
            <h2 className='goBackLink' onClick={() => navigate(-1)}>Повернутися назад</h2>
            <div className="entrance-block first-step">
                <h1 className="entrance-title">
                    Створити акаунт
                </h1>
                <div className="entranceInputSec">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='entranceInput entranceEmail' placeholder="Адреса електронної пошти" onBlur={(e) => checkTheEmail(e.target.value)}/>
                    {emailStatus != '' ? <div className='sub-input-error'>{emailStatus}</div> : ''}
                </div>
                <div className="entranceInputSec">
                    <input type={passwordShown ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='entranceInput' placeholder="Пароль..."/>
                    {password.length ? <img src={passwordShown ? '/src/assets/img/eyehidden.svg' : '/src/assets/img/eyeshown.svg'} onClick={() => showPassword(!passwordShown)} alt="" className='passwordEye'/> : ''}
                </div>
                <h6 className="inputName">Повторіть пароль</h6>
                <div className="entranceInputSec">
                    <input type={secondShown ? 'text' : 'password'} value={secondPassword} onChange={(e) => repeatPassword(e.target.value)} className='entranceInput passwordRepeat'placeholder='Пароль...' onBlur={() => checkThePassword()}/>
                    {secondPassword.length ? <img src={secondShown ? '/src/assets/img/eyehidden.svg' : '/src/assets/img/eyeshown.svg'} onClick={() => showSecondPassword(!secondShown)} alt="" className='passwordEye'/> : ''}
                    {passwordStatus != '' ? <div className='sub-input-error'>{passwordStatus}</div> : ''}
                </div>
                <div className='entrance-footer'>
                <button className={email.length && password.length && secondPassword.length && emailStatus == '' && passwordStatus == '' ? 'entrance-button allowed' : 'entrance-button'} onClick={() => handleGoAhead()}>Далі</button>
                <h3>
                    Маєте аккаунт? <Link to='/LogIn'>Увійти</Link>
                </h3>
                </div>
            </div>
            <div className="entrance-block second-step">
                <h1 className="entrance-title">
                    Створити акаунт
                </h1>
                <h6 className="inputName">Вкажіть Вашу особисту інформацію</h6>
                <div className="entranceInputSec">
                    <input type="text" value={userFirst} onChange={(e) => setUserFirst(e.target.value)} className='entranceInput' placeholder="Ім'я" onBlur={(e) => checkTheEmail(e.target.value)}/>
                    {emailStatus != '' ? <div className='sub-input-error'>{emailStatus}</div> : ''}
                </div>
                <div className="entranceInputSec">
                    <input type='text' value={userLast} onChange={(e) => setUserLast(e.target.value)} className='entranceInput' placeholder="Прізвище"/>
                </div>
                <div className='entrance-checkbox'>
                    <input type="checkbox" id='agreement-checkbox' checked={agrAccepted} onChange={() => acceptAgreement(!agrAccepted)}/>
                    <label htmlFor="agreement-checkbox">
                    </label>
                    <h3>
                    Я погоджуюсь з умовами політики конфіденційності і дозволяю обробляти мої персональні дані
                    </h3>
                </div>
                <div className='entrance-footer'>
                <button className={userFirst.length && userLast.length && agrAccepted ? 'entrance-button allowed' : 'entrance-button'} onClick={() => handleSignUp()}>Створити акаунт</button>
                <h3>
                    Маєте аккаунт? <Link to='/LogIn'>Увійти</Link>
                </h3>
                </div>
            </div>
        </div>
        </>
    );
}

export default SignUpComponent;
