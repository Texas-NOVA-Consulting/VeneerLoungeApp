import React, { useState, useRef } from 'react';
import axios from 'axios';
import SmileQuiz from './SmileQuiz';
import DragDropUploader from './DragDropUploader';
import generatePdfReport from './PdfReport';

// Add webcam support
import Webcam from 'react-webcam';

function App() {
  const [currentStep, setCurrentStep] = useState('quiz'); // quiz, upload, results
  const [image, setImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedShade, setSelectedShade] = useState('Natural White');
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [dentistMode, setDentistMode] = useState(false);
  const [dentistInfo, setDentistInfo] = useState({ name: '', clinic: '', phone: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  // Shade options and their corresponding prompts
  const shadeOptions = [
    { value: 'Natural White', label: 'Natural White', prompt: '' },
    { value: 'BL1 – Hollywood White', label: 'BL1 – Hollywood White', prompt: 'ultra bright veneers, celebrity white' },
    { value: 'BL2 – Porcelain White', label: 'BL2 – Porcelain White', prompt: 'bright porcelain veneers' },
    { value: 'A1 – Slightly Warm White', label: 'A1 – Slightly Warm White', prompt: 'subtle warm white veneers' },
    { value: 'A2 – Natural Yellow Tint', label: 'A2 – Natural Yellow Tint', prompt: 'light natural yellow tint veneers' }
  ];

  // The original prompt and negative prompt
  const originalPrompt =
    "photo of perfectsmile smile <lora:lora_perfectsmile_v1_from_v1_160:1>(Beautiful natural teeth, aligned bite teeth), aligned white teeth, human like teeth, (no teeth gap), celebrity-like teeth, healthy teeth with a perfect smile, not big incisor,good proportion teeth,good proportion smile,";
  const originalNegativePrompt =
    "(deformed teeth, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), (deformed, distorted, abnormal teeth:1.3, disfigured:1.3, large teeth:2),poorly drawn,Fixer, bad anatomy, rabbit teeth, wrong anatomy, missing teeth, disconnected teeth, unnatural mouth, bunny teeth,big incisor teeth,disproportionate front teeth, bad smile, reflection, crooked teeth, distorted teeth,cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, morbid,disfigured, gross proportions,too many teeth,lipstick, lip gloss, too less teeth, unnatural size teeth, poorly drawn mouth, poorly drawn teeth";

  const handleQuizComplete = (data) => {
    setQuizAnswers(data.quizAnswers);
    setEmail(data.email);
    setSelectedShade(data.suggestedShade);
    setPrompt(data.suggestedPrompt);
    setCurrentStep('upload');
  };

  const handleQuizSkip = () => {
    setCurrentStep('upload');
  };

  const handleImageSelect = (file) => {
    setImage(file);
    // Create a preview URL for the original image
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleShadeChange = (e) => {
    const selected = shadeOptions.find(option => option.value === e.target.value);
    setSelectedShade(selected.value);
    setPrompt(selected.prompt);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setError('');
    setLoading(true);
    setCurrentImageIndex(0); // Reset to first image

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const requestData = {
          image: base64Image,
          prompt: originalPrompt,
          negative_prompt: originalNegativePrompt,
          num_outputs: dentistMode ? 4 : 1
        };
        const response = await axios.post('/api/simulate', requestData);
        
        // Ensure outputUrl is always an array
        if (response.data.output) {
          const outputArray = Array.isArray(response.data.output) ? response.data.output : [response.data.output];
          setOutputUrl(outputArray);
          console.log('Received images:', outputArray.length, outputArray);
        } else {
          throw new Error('No output received from server');
        }
        
        setCurrentStep('results');

        // Send lead data if email provided
        if (email) {
          try {
            await axios.post('/api/lead', {
              email,
              quizAnswers,
              dentistInfo: dentistMode ? dentistInfo : null
            });
          } catch (error) {
            console.error('Failed to capture lead:', error);
          }
        }
      } catch (error) {
        let errorMessage = 'An error occurred while processing the image. Please try again.';
        
        // Handle specific error types
        if (error.response?.data?.error) {
          const backendError = error.response.data.error;
          
          if (backendError.includes('face') || backendError.includes('Face')) {
            errorMessage = '🫣 Face Detection Issue: ' + backendError;
          } else if (backendError.includes('timeout')) {
            errorMessage = '⏰ Processing Timeout: The image took too long to process. Please try with a smaller or clearer image.';
          } else if (backendError.includes('Invalid image format')) {
            errorMessage = '📷 Invalid Image: Please upload a valid image file (JPEG, PNG, etc.).';
          } else {
            errorMessage = backendError;
          }
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = '🔌 Connection Error: Unable to connect to the server. Please check your internet connection.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setOutputUrl([]);
      }
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };

  // Camera capture logic
  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Convert data URL to File object for consistency
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          setImage(file);
          setOriginalImageUrl(imageSrc); // Set the original image URL
          setShowCamera(false);
        });
    }
  };

  const handlePdfDownload = async () => {
    if (!originalImageUrl || !outputUrl || outputUrl.length === 0) return;

    await generatePdfReport({
      originalImage: originalImageUrl,
      veneerImages: outputUrl,
      selectedShade,
      prompt,
      email,
      dentistInfo: dentistMode ? dentistInfo : null,
      quizAnswers
    });
  };

  const resetApp = () => {
    setCurrentStep('quiz');
    setImage(null);
    setOriginalImageUrl(null);
    setOutputUrl([]);
    setError('');
    setSelectedShade('Natural White');
    setPrompt('');
    setEmail('');
    setQuizAnswers(null);
    setDentistInfo({ name: '', clinic: '', phone: '' });
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (outputUrl && currentImageIndex < outputUrl.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToImage = (index) => {
    if (outputUrl && index >= 0 && index < outputUrl.length) {
      setCurrentImageIndex(index);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#333', margin: 0 }}>
            🦷 VeneerVision AI
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={dentistMode}
                onChange={(e) => setDentistMode(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>Dentist Mode</span>
            </label>
            
            {currentStep !== 'quiz' && (
              <button
                onClick={resetApp}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Quiz Step */}
        {currentStep === 'quiz' && (
          <SmileQuiz onComplete={handleQuizComplete} onSkip={handleQuizSkip} />
        )}

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div>
            {/* Dentist Info Form */}
            {dentistMode && (
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '15px',
                marginBottom: '30px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0, color: '#007bff' }}>🏥 Dentist Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Dentist Name"
                    value={dentistInfo.name}
                    onChange={(e) => setDentistInfo(prev => ({ ...prev, name: e.target.value }))}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                  <input
                    type="text"
                    placeholder="Clinic Name"
                    value={dentistInfo.clinic}
                    onChange={(e) => setDentistInfo(prev => ({ ...prev, clinic: e.target.value }))}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={dentistInfo.phone}
                    onChange={(e) => setDentistInfo(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>📸 Upload Your Smile Photo</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Upload a clear photo of your smile to see how veneers would look on you.
              </p>
              
              <DragDropUploader onFileSelect={handleImageSelect} />
              
              {image && (
      <div style={{ marginTop: '20px' }}>
                  <h4>Selected Image:</h4>
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Selected" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px' }}
                  />
                </div>
              )}
            </div>

            {/* Veneer Shade Selector */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>🎨 Select Veneer Shade</h3>
              <select
                value={selectedShade}
                onChange={handleShadeChange}
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                {shadeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {prompt && (
                <p style={{ marginTop: '10px', color: '#666', fontStyle: 'italic' }}>
                  AI Prompt: "{prompt}"
                </p>
              )}
            </div>

            {/* Take Photo Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={handleTakePhoto}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                📸 Take Photo
              </button>
            </div>

            {/* Camera Modal */}
            {showCamera && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={350}
                  videoConstraints={{ facingMode: 'user' }}
                  style={{ borderRadius: '10px', border: '2px solid #007bff' }}
                />
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={handleCapture}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              style={{
                padding: '15px 30px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              {loading ? '🔄 Processing...' : '✨ Generate Veneer Preview'}
            </button>

            {error && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '5px',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && outputUrl && outputUrl.length > 0 && (
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>✨ Your Veneer Preview</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Slide to compare before and after
              </p>

              {/* Simple Side-by-Side Comparison */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4>Before</h4>
                  <img 
                    src={originalImageUrl} 
                    alt="Original" 
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '300px', 
                      borderRadius: '10px',
                      border: '2px solid #ddd'
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4>After</h4>
                  <img 
                    src={outputUrl[currentImageIndex]} 
                    alt="Veneer Preview" 
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '300px', 
                      borderRadius: '10px',
                      border: '2px solid #007bff'
                    }}
                  />
                </div>
              </div>

              {/* Image Navigation */}
              {outputUrl.length > 1 && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <h4 style={{ marginBottom: '15px', color: '#333' }}>
                    Image {currentImageIndex + 1} of {outputUrl.length}
                  </h4>
                  
                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: currentImageIndex === 0 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ← Previous
                    </button>
                    
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === outputUrl.length - 1}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: currentImageIndex === outputUrl.length - 1 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: currentImageIndex === outputUrl.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      Next →
                    </button>
                  </div>

                  {/* Image Dots */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                    {outputUrl.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: index === currentImageIndex ? '#007bff' : '#ddd',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => window.open(outputUrl[currentImageIndex], '_blank')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  📥 Download Current Image
                </button>
                
                <button
                  onClick={handlePdfDownload}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  📄 Download PDF Report
                </button>
              </div>
            </div>

            {/* All Images Grid View */}
            {outputUrl.length > 1 && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '30px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0, color: '#333', textAlign: 'center' }}>🎨 All Generated Variations</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '20px' 
                }}>
                  {outputUrl.map((url, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <h4>Variation {index + 1}</h4>
                      <img 
                        src={url} 
                        alt={`Veneer Variation ${index + 1}`} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '250px', 
                          borderRadius: '10px',
                          border: index === currentImageIndex ? '3px solid #007bff' : '2px solid #ddd',
                          cursor: 'pointer'
                        }}
                        onClick={() => goToImage(index)}
                      />
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => goToImage(index)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => window.open(url, '_blank')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;