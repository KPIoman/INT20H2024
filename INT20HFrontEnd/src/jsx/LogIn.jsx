import React, {useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import Header from '../components/header';
import eyeShown from '../assets/img/eyeshown.svg'
import eyeHidden from '../assets/img/eyehidden.svg'
import '../css/entrance.css'
import axios from 'axios'


function LogInComponent({userInfo, setUserInfo, accountInfo}) {
    const [userFirst, setUserFirst] = useState('');
    const [userLast, setUserLast] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('')
    const [password, setPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('')
    const [passwordShown, showPassword] = useState(false)
    const navigate = useNavigate()
    const firstStep = document.querySelector('.first-step')
    const updatePassword = document.querySelector('.update-password-step')
    const [authToken, setToken] = useState('')

    // const codeSent = document.querySelector('.code-sent-step')
    // const newPasswordStep = document.querySelector('.new-password-step')


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
    

    async function handleLogIn() {
        if (email.length && password.length) {
            let sendObj = {
                password: password,
                email: email
            }
            await axios.post('https://artion-backend.onrender.com/login', sendObj).then(res => {
                setUserInfo(res.data.autorization)

            })
        }
    }

    function handleForgotPassword() {
        firstStep.style.display = 'none'
        updatePassword.style.display = 'block'
    }

    return (
        <>
        <div className="entrance-background">
            <h2 className='goBackLink' onClick={() => navigate(-1)}>Повернутися назад</h2>
            <div className="entrance-block first-step">
                <h1 className="entrance-title">
                    Увійти в обліковий запис
                </h1>
                <div className="entranceInputSec">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='entranceInput entranceEmail' placeholder="Адреса електронної пошти" onBlur={(e) => checkTheEmail(e.target.value)}/>
                    {emailStatus != '' ? <div className='sub-input-error'>{emailStatus}</div> : ''}
                </div>
                <div className="entranceInputSec">
                    <input type={passwordShown ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='entranceInput' placeholder="Пароль..."/>
                    {password.length ? <img src={passwordShown ? '/src/assets/img/eyehidden.svg' : '/src/assets/img/eyeshown.svg'} onClick={() => showPassword(!passwordShown)} alt="" className='passwordEye'/> : ''}
                    <h4 className='forgot-password-button' onClick={() => handleForgotPassword()}>Забули пароль?</h4>
                </div>
                <div className='entrance-footer'>
                <button className={email.length && password.length ? 'entrance-button allowed' : 'entrance-button'} onClick={() => handleLogIn()}>Увійти</button>
                <h3>
                   Немає акаунта? <Link to='/SignUp'>Створити акаунт</Link>
                </h3>
                </div>
            </div>
            <div className="entrance-block update-password-step">
                <h1 className="entrance-title">
                    Оновлення пароля
                </h1>
                <div className="entranceInputSec">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='entranceInput entranceEmail' placeholder="Адреса електронної пошти" onBlur={(e) => checkTheEmail(e.target.value)}/>
                    {emailStatus != '' ? <div className='sub-input-error'>{emailStatus}</div> : ''}
                </div>
                <div className='entrance-footer'>
                <button className={email.length && password.length ? 'entrance-button allowed' : 'entrance-button'} onClick={() => handleLogIn()}>Далі</button>
                <h3>
                   Немає акаунта? <Link to='/SignUp'>Створити акаунт</Link>
                </h3>
                </div>
            </div>
        </div>
        </>
    );
}

export default LogInComponent;
