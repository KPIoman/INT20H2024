import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/home.css"
import "../css/collection.css"
import "../css/base.css"
import Header from '../components/header';
import "../css/addLot.css"
import "../css/lot.css"
import axios from 'axios';
import Footer from '../components/footer';
import FileUpload from '../components/photoUploader'; // Импортируем компонент PhotoUploader

const AddLot = ({ userInfo }) => {
  const [lotName, setLotName] = useState('');
  const [lotDescr, setDescr] = useState('');
  const [photoList, setPhotoList] = useState([]);
  const [dateEnd, setDate] = useState('')
  const [realName, setRealName] = useState('')
  const [realEmail, setRealEmail] = useState('')
  const [realTel, setRealTel] = useState('')
  const [isAllowed, setIsAllowed] = useState(false)
  const [startPrice, setStartPrice] = useState(0) 
  const [tag, setTag] = useState(0)
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  const handleFileChange = (file) => {
    // Добавляем новый файл к текущему списку фотографий
    setPhotoList([...photoList, file]);
  };

  const handleUpload = async () => {
    try {

      const formData = new FormData();
      formData.append('mainName', lotName);
      formData.append('description', lotDescr);
      formData.append('startPrice', startPrice);
      formData.append('tag', selectedValue);
      formData.append('timeToEnd', dateEnd);
      formData.append('contactInfo', {realName: realName, phoneNumber: realTel, email: realEmail});
      for (let el of photoList) {
        formData.append('images', el)
      }

      const response = await axios.post('https://artion-backend.onrender.com/addLot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Обрабатываем ответ от сервера
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handlePost = () => {
    if (lotName.length > 0 && lotDescr.length > 0 && photoList.length > 0 && dateEnd.length > 0 && startPrice > 0 && realName.length > 0 && realEmail.length > 0 && realTel.length > 0) {
      setIsAllowed(true)
    } else {
      setIsAllowed(false)
    }
  }

  async function postNewLot() {

    try {
        console.log(obj);
        await axios.post('https://artion-backend.onrender.com/addLot', obj, {Authorization: `Token ${userInfo}`})
    }catch(error) {
        console.log(error);
    }
  }


  return (
    <>
      <Header userInfo={userInfo}></Header>
      <div className="container">
        <div className='links-way'>
          <Link to='/'>Головна сторінка</Link><span>/</span>
          <h3 className='lot-upper-title'>
            Створити оголошення
          </h3>
        </div>
        <h1 className="addLottitle">
          Створити оголошення
        </h1>
        <div className="AddSection">
          <h2 className="addSetionName">
            Вкажіть назву товару
          </h2>
          <input className="AddInput" type="text" value={lotName} onChange={(e) => setLotName(e.target.value)} onBlur={handlePost} placeholder='Наприклад, Антикваріатне дзеркало ' />
          <h2 className="addSetionName margintop">
            Додайте опис товару
          </h2>
          <textarea className='AddInputArea' value={lotDescr} onChange={(e) => setDescr(e.target.value)} onBlur={handlePost} placeholder='Додайте детальний опис вашого товару'></textarea>
          <h2 className="addSetionName margintop">
            Додайте тег
          </h2>
          <select name="" id="" className='AddSelect' onChange={handleSelectChange} value={selectedValue}>
  <option value="1">Дзеркала</option>
  <option value="2">Рукописи</option>
  <option value="3">Монети</option>
  <option value="4">Картини</option>
  <option value="5">Одяг</option>
  <option value="6">Платівки</option>
  <option value="7">Посуд</option>
  <option value="8">Фотографії</option>
  <option value="9">Іграшки</option>
</select>

        </div>
        <div className="AddSection">
          <h2 className="addSetionName">
            Фото
          </h2>
          <h3 className="addSetionSubHeading">
            Додайте фото
          </h3>
          <div className="photo-getter-addLot">
            <FileUpload onFileChange={handleFileChange} />
            <FileUpload onFileChange={handleFileChange} />
            <FileUpload onFileChange={handleFileChange} />
            <FileUpload onFileChange={handleFileChange} />
          </div>
        </div>
        <div className="AddSection">
        <h2 className="addSetionName">
            Стартова ціна
          </h2>
          <input type="number" className='AddInput' placeholder='Введіть стартову ціну (у долларах)' value={dateEnd} onBlur={handlePost} onChange={(e) => setDate(e.target.value)} />
          <h2 className="addSetionName margintop">
            Скільки часу буде тривати аукціон
          </h2>
          <input type="text" className='AddInput' placeholder='Введіть дату у форматі Дні:Години:Хвилини:Секунди' value={startPrice} onBlur={handlePost} onChange={(e) => setStartPrice(e.target.value)} />
        </div>
        <div className="AddSection">
          <h2 className="addSetionName">
            Ваша контактна інформація
          </h2>
          <h2 className="addSetionName margintop">
            Ім'я контактної особи
          </h2>
          <input type="text" className='AddInput' placeholder='Андрій Шевченко' value={realName} onBlur={handlePost} onChange={(e) => setRealName(e.target.value)} />
          <h2 className="addSetionName margintop">
            Email адреса
          </h2>
          <input type="email" className='AddInput' placeholder='andriyshevchenko@gmail.com' onBlur={handlePost} value={realEmail} onChange={(e) => setRealEmail(e.target.value)} />
          <h2 className="addSetionName margintop">
            Номер телефону
          </h2>
          <input type="tel" className='AddInput' placeholder='+380669383988' value={realTel} onBlur={handlePost} onChange={(e) => setRealTel(e.target.value)} />
        </div>
        <div className={isAllowed ? 'postButton allowed' : 'postButton'} onClick={isAllowed ? postNewLot() : handlePost}>
          Опублікувати
        </div>
      </div>
    </>
  );
}

export default AddLot;

