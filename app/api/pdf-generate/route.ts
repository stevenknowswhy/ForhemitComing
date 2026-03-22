import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max for PDF generation

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
    
    // Detect if request is from mobile
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    
    // Launch headless browser with serverless-compatible chromium
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    
    const page = await browser.newPage();
    
    // Set viewport based on device type
    await page.setViewport({
      width: isMobile ? 375 : 1200,
      height: 800,
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
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
    await page.setContent(fullHtml, { 
      waitUntil: ['networkidle0', 'domcontentloaded'] 
    });
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Additional wait for any images or external resources
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate PDF with proper pagination
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { 
        top: '20mm', 
        right: '20mm', 
        bottom: '20mm', 
        left: '20mm' 
      },
      preferCSSPageSize: false,
    });
    
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
