const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION || '4956c634b9aa976129f13166c713f8cf38bd337cd58c77925e8cd71d935d5696';

// CORS configuration for different ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    model: 'sourav-sarkar-doc32/smile-correct'
  });
});

// Helper function to poll for prediction completion with increased timeout
async function pollPrediction(predictionId, timeout = 240000) { // Increased to 4 minutes
  const pollInterval = 2000; // 2 seconds
  const startTime = Date.now();
  const getUrl = `https://api.replicate.com/v1/predictions/${predictionId}`;

  while (Date.now() - startTime < timeout) {
    try {
      const pollResponse = await axios.get(getUrl, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = pollResponse.data;
      console.log('Replicate poll response:', data);
      
      if (data.status === 'succeeded') {
        // Check if output exists and is valid
        if (data.output && Array.isArray(data.output) && data.output.length > 0) {
          return data.output;
        } else if (data.output && typeof data.output === 'string') {
          // Handle case where output is a single string URL
          return [data.output];
        } else {
          throw new Error('No valid output received from Replicate API');
        }
      }
      
      if (data.status === 'failed' || data.status === 'canceled') {
        // Check for specific error messages
        const errorMessage = data.error || 'Prediction failed';
        if (errorMessage.includes('No face detected')) {
          throw new Error('No face detected in the image. Please upload a clear photo with a visible face.');
        } else if (errorMessage.includes('face')) {
          throw new Error('Face detection failed. Please ensure the image contains a clear, well-lit face.');
        } else {
          throw new Error(errorMessage);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('Error during polling:', error.message);
      if (error.response?.status === 404) {
        throw new Error('Prediction not found');
      }
      // If it's a face detection error, throw immediately
      if (error.message.includes('face') || error.message.includes('Face')) {
        throw error;
      }
      // Continue polling for other errors
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  throw new Error('Prediction timeout - the model took too long to process your image (4 minutes exceeded)');
}

// Lead capture endpoint
app.post('/api/lead', (req, res) => {
  const { email, quizAnswers, dentistInfo } = req.body;
  
  console.log('📧 New Lead Captured:', {
    email,
    quizAnswers,
    dentistInfo,
    timestamp: new Date().toISOString()
  });
  
  // TODO: Save to database
  res.json({ success: true, message: 'Lead captured successfully' });
});

app.post('/api/simulate', async (req, res) => {
  const { image, prompt, negative_prompt, num_outputs = 1 } = req.body;

  console.log('Received request with num_outputs:', num_outputs);

  // Input validation
  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image format. Please upload a valid image file.' });
  }

  // Validate prompt length
  if (prompt && prompt.length > 300) {
    return res.status(400).json({ error: 'Prompt too long (max 300 characters)' });
  }

  // The original prompt string to use if not provided
  const originalPrompt =
    "photo of perfectsmile smile <lora:lora_perfectsmile_v1_from_v1_160:1>(Beautiful natural teeth, aligned bite teeth), aligned white teeth, human like teeth, (no teeth gap), celebrity-like teeth, healthy teeth with a perfect smile, not big incisor,good proportion teeth,good proportion smile,";
  const originalNegativePrompt =
    "(deformed teeth, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), (deformed, distorted, abnormal teeth:1.3, disfigured:1.3, large teeth:2),poorly drawn,Fixer, bad anatomy, rabbit teeth, wrong anatomy, missing teeth, disconnected teeth, unnatural mouth, bunny teeth,big incisor teeth,disproportionate front teeth, bad smile, reflection, crooked teeth, distorted teeth,cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, morbid,disfigured, gross proportions,too many teeth,lipstick, lip gloss, too less teeth, unnatural size teeth, poorly drawn mouth, poorly drawn teeth";

  try {
    // Create all predictions in parallel
    console.log(`Starting ${num_outputs} predictions in parallel...`);
    
    const predictionPromises = [];
    
    for (let i = 0; i < num_outputs; i++) {
      console.log(`Creating prediction ${i + 1}...`);
      
      const predictionPromise = axios.post('https://api.replicate.com/v1/predictions', {
        version: MODEL_VERSION,
        input: {
          image,
          prompt: prompt || originalPrompt,
          negative_prompt: negative_prompt || originalNegativePrompt,
        },
      }, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }).then(async (predictionResponse) => {
        console.log(`Prediction ${i + 1} created:`, predictionResponse.data.id);
        
        // Poll for completion
        const outputUrls = await pollPrediction(predictionResponse.data.id);
        console.log(`Prediction ${i + 1} completed with ${outputUrls.length} images`);
        return outputUrls;
      }).catch((error) => {
        console.error(`Prediction ${i + 1} failed:`, error.message);
        throw error;
      });
      
      predictionPromises.push(predictionPromise);
    }
    
    // Wait for all predictions to complete
    console.log('Waiting for all predictions to complete...');
    const results = await Promise.all(predictionPromises);
    
    // Flatten all results into a single array
    const allImages = results.flat();
    console.log(`Successfully generated ${allImages.length} total images`);
    
    return res.json({ output: allImages });
    
  } catch (error) {
    console.error('Error during prediction:', error);
    return res.status(500).json({ error: error.message || 'Prediction error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));