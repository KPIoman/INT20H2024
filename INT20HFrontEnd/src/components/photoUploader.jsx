import React, { useState } from 'react';

const FileUpload = ({ onFileChange }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
  };

  return (
    <input className='photo-getter-item'
      type="file"
      accept="image/*"
      onChange={handleFileChange}
    ></input>
  );
};

export default FileUpload;
