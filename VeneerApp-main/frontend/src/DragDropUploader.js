import React, { useState, useRef } from 'react';

const DragDropUploader = ({ onFileSelect, acceptedFileTypes = "image/*" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '200px',
        border: `3px dashed ${isDragOver ? '#007bff' : '#ddd'}`,
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: isDragOver ? '#f0f8ff' : '#f8f9fa',
        transition: 'all 0.3s ease',
        margin: '0 auto'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {selectedFile ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
            {selectedFile.name}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Click to change image
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
          <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {isDragOver ? 'Drop your image here' : 'Upload your smile photo'}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Drag & drop or click to browse
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropUploader; 