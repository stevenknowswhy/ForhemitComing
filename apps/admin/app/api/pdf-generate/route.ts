import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max for PDF generation

// Check if we're in production (Vercel) or development
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

interface PDFGenerateRequest {
  formData: Record<string, unknown>;
  templateId: string;
  templateName: string;
  htmlContent: string;
  cssContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PDFGenerateRequest = await request.json();
    const { htmlContent, cssContent = '', templateName } = body;
    
    console.log('PDF generation started for:', templateName);
    
    // Detect if request is from mobile
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    
    // Launch headless browser with serverless-compatible chromium
    let browser;
    try {
      console.log('Launching browser...', 'Production:', isProduction);
      
      if (isProduction) {
        // Production: Use @sparticuz/chromium
        browser = await puppeteer.launch({
          args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      } else {
        // Development: Try to use system Chrome/Chromium
        // Common paths for Chrome on different OS
        const possiblePaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          'C:\Program Files\Google\Chrome\Application\chrome.exe',
          'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
        ];
        
        let executablePath = '';
        for (const path of possiblePaths) {
          try {
            const fs = await import('fs');
            if (fs.existsSync(path)) {
              executablePath = path;
              console.log('Found Chrome at:', path);
              break;
            }
          } catch {
            // Continue to next path
          }
        }
        
        if (!executablePath) {
          throw new Error('Chrome/Chromium not found. Please install Chrome or use the production build.');
        }
        
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath,
          headless: true,
        });
      }
      
      console.log('Browser launched successfully');
    } catch (browserError) {
      console.error('Browser launch error:', browserError);
      return NextResponse.json(
        { 
          error: 'Browser launch failed',
          message: browserError instanceof Error ? browserError.message : 'Failed to launch browser. For local development, ensure Chrome is installed.',
        },
        { status: 500 }
      );
    }
    
    const page = await browser.newPage();

    // Check if this is a letter-sized template (Broker templates)
    const isLetterTemplate = templateName.includes('Broker') || templateName.includes('Letter');

    // Set viewport - use higher width for letter templates to ensure proper rendering
    await page.setViewport({
      width: isMobile ? 375 : (isLetterTemplate ? 1000 : 1200),
      height: isMobile ? 800 : (isLetterTemplate ? 1300 : 800),
      deviceScaleFactor: 2,
    });
    
    // Construct the full HTML with forced light theme for PDF
    const fullHtml = `
<!DOCTYPE html>
<html data-theme="light" data-pdf="true">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Newsreader:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* Critical PDF styles - forced light theme */
    :root {
      --theme-bg: #ffffff;
      --theme-bg-secondary: #f8f9fa;
      --theme-text: #1f2937;
      --theme-text-muted: #6b7280;
      --theme-border: #e5e7eb;
      --theme-accent: #1e3a5f;
      --theme-accent-hover: #2a4a6f;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #ffffff !important;
      color: #1f2937 !important;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Crimson Pro', Georgia, serif;
      color: #1f2937 !important;
      margin: 0 0 1rem 0;
    }
    
    .font-mono {
      font-family: 'DM Mono', monospace;
    }
    
    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: avoid;
    }
    
    th, td {
      padding: 12px;
      border: 1px solid #e5e7eb;
      text-align: left;
    }
    
    th {
      background: #f8f9fa !important;
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    
    td {
      font-size: 0.875rem;
    }
    
    /* Page break controls */
    table, .section-container, .form-section {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    tr {
      page-break-inside: avoid !important;
    }
    
    /* Hide UI elements */
    .no-print, .template-modal-actions, .step-indicator, 
    button:not(.print-only), .form-nav {
      display: none !important;
    }
    
    /* Form container */
    .form-container, .esop-form-container, .h2h-form-container,
    .term-form-container, .di-container, .erm-form-container, .lqa-form-container {
      background: #ffffff !important;
      color: #1f2937 !important;
      padding: 20px;
    }
    
    /* Cards */
    .card, .h2h-comparison-card, .h2h-structure-card {
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    /* Accent colors */
    .accent-navy, .text-accent {
      color: #1e3a5f !important;
    }
    
    .bg-accent {
      background: #1e3a5f !important;
      color: #ffffff !important;
    }
    
    /* Input styling for print */
    input, textarea {
      background: transparent !important;
      border: 1px solid #e5e7eb !important;
      padding: 8px;
      font-family: 'DM Mono', monospace;
    }

    /* Page break support for PDF generation */
    .pdf-document {
      page-break-inside: avoid;
    }

    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    /* Force page break when element has page-break-before style */
    *[style*="page-break-before"] {
      break-before: page !important;
      -webkit-break-before: page !important;
      -moz-break-before: page !important;
    }

    /* Force page break when element has break-before style */
    *[style*="break-before"] {
      break-before: page !important;
      -webkit-break-before: page !important;
      -moz-break-before: page !important;
    }

    /* Avoid breaking inside tables */
    table {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Avoid breaking inside cards and callouts */
    .bie-callout, .bie-pay-grid, .bie-deal-table-wrap {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* PDF Page break class - forces a new page */
    .pdf-new-page {
      page-break-before: always !important;
      break-before: page !important;
      -webkit-break-before: page !important;
      display: block !important;
    }
    
    /* Custom CSS from client */
    ${cssContent}
  </style>
</head>
<body>
  <div class="pdf-document">
    ${htmlContent}
  </div>
</body>
</html>`;
    
    // Set content and wait for fonts to load
    try {
      console.log('Setting page content...');
      await page.setContent(fullHtml, { 
        waitUntil: ['networkidle0', 'domcontentloaded'] 
      });
      console.log('Page content set');
      
      // Wait for fonts to load
      await page.evaluate(() => document.fonts.ready);
      
      // Additional wait for any images or external resources
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Generating PDF...');

      // Use Letter format for US letter-sized templates, A4 for others
      const isLetterTemplate = templateName.includes('Broker') || templateName.includes('Letter');
      const pdfFormat = isLetterTemplate ? 'Letter' : 'A4';

      // Adjust margins based on template - letter templates have built-in padding
      const margins = isLetterTemplate
        ? { top: '0', right: '0', bottom: '0', left: '0' }  // No extra margins - HTML has padding
        : { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' };  // Standard margins for A4

      // Generate PDF with proper pagination
      const pdf = await page.pdf({
        format: pdfFormat,
        printBackground: true,
        margin: margins,
        preferCSSPageSize: true,
      });
      console.log('PDF generated successfully');
      
      await browser.close();
      
      // Return PDF as response
      return new NextResponse(Buffer.from(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${templateName.replace(/\s+/g, '-')}-${Date.now()}.pdf"`,
          'Cache-Control': 'no-cache',
        },
      });
    } catch (pageError) {
      console.error('Page/PDF error:', pageError);
      await browser.close();
      return NextResponse.json(
        { 
          error: 'PDF generation failed',
          message: pageError instanceof Error ? pageError.message : 'Unknown page error',
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('PDF generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'PDF generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
