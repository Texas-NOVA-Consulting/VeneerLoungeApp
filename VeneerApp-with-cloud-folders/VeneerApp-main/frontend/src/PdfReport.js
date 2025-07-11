import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePdfReport = async ({
  originalImage,
  veneerImages,
  selectedShade,
  prompt,
  email,
  dentistInfo,
  quizAnswers
}) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(0, 123, 255);
  pdf.text('VeneerVision AI Smile Report', pageWidth / 2, 30, { align: 'center' });

  // Date
  pdf.setFontSize(12);
  pdf.setTextColor(100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' });

  // Patient info
  if (email) {
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text(`Patient Email: ${email}`, margin, 60);
  }

  // Dentist info (if in dentist mode)
  if (dentistInfo) {
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text(`Dentist: ${dentistInfo.name}`, margin, 75);
    pdf.text(`Clinic: ${dentistInfo.clinic}`, margin, 85);
    pdf.text(`Phone: ${dentistInfo.phone}`, margin, 95);
  }

  // Quiz answers (if available)
  if (quizAnswers) {
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text('Patient Preferences:', margin, 110);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Ideal Look: ${quizAnswers.idealLook}`, margin, 120);
    pdf.text(`Skin Tone: ${quizAnswers.skinTone}`, margin, 130);
    pdf.text(`Face Shape: ${quizAnswers.faceShape}`, margin, 140);
  }

  // Selected shade and prompt
  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text(`Selected Veneer Shade: ${selectedShade}`, margin, 155);
  if (prompt) {
    pdf.text(`AI Prompt: ${prompt}`, margin, 165);
  }

  // Images section
  let yPosition = 180;

  // Original image
  if (originalImage) {
    try {
      const originalCanvas = await html2canvas(originalImage, {
        useCORS: true,
        allowTaint: true,
        scale: 0.5
      });
      const originalImgData = originalCanvas.toDataURL('image/jpeg', 0.8);
      
      const imgWidth = 60;
      const imgHeight = (originalCanvas.height * imgWidth) / originalCanvas.width;
      
      pdf.text('Original Smile:', margin, yPosition);
      pdf.addImage(originalImgData, 'JPEG', margin, yPosition + 5, imgWidth, imgHeight);
      yPosition += imgHeight + 20;
    } catch (error) {
      console.error('Error processing original image:', error);
    }
  }

  // Veneer images
  if (veneerImages && veneerImages.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text('Veneer Results:', margin, yPosition);
    yPosition += 10;

    const imagesPerRow = 2;
    const imgWidth = (pageWidth - 2 * margin - 10) / imagesPerRow;
    
    for (let i = 0; i < veneerImages.length; i++) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = veneerImages[i];
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgHeight = (img.height * imgWidth) / img.width;
        
        const xPos = margin + (i % imagesPerRow) * (imgWidth + 10);
        const yPos = yPosition + Math.floor(i / imagesPerRow) * (imgHeight + 20);
        
        // Check if we need a new page
        if (yPos + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const label = dentistInfo ? `Variation ${i + 1}` : 'Enhanced Smile';
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(label, xPos, yPos - 5);
        
        pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
        
        if ((i + 1) % imagesPerRow === 0) {
          yPosition += imgHeight + 25;
        }
      } catch (error) {
        console.error(`Error processing veneer image ${i}:`, error);
      }
    }
  }

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Download the PDF
  const fileName = `smile-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export default generatePdfReport; 