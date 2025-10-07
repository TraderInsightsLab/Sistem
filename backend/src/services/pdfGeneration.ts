import * as puppeteer from 'puppeteer';
import { UserContext, AIAnalysisResult } from '../../../shared/types';

interface ReportData {
  sessionId: string;
  userContext: UserContext;
  analysisResults: AIAnalysisResult;
  generatedAt: Date;
}

export class PDFGenerationService {
  
  async generateReport(data: ReportData): Promise<Buffer> {
    let browser;
    
    try {
      console.log('Launching browser for PDF generation...');
      
      // Launch browser with appropriate settings for Cloud Functions
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process'
        ],
        headless: true
      });

      const page = await browser.newPage();
      
      // Set page size for PDF
      await page.setViewport({ width: 1200, height: 1600 });
      
      // Generate HTML content
      const htmlContent = this.generateHTMLReport(data);
      
      // Set content and wait for it to load
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      console.log('Generating PDF...');
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px;">
            TraderInsightsLab - Raport Psihologic Personalizat
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `
      });
      
      console.log('PDF generated successfully');
      return pdfBuffer;

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private generateHTMLReport(data: ReportData): string {
    const { userContext, analysisResults, generatedAt, sessionId } = data;
    
    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raport TraderInsightsLab</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #666;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 20px;
            border-left: 5px solid #3B82F6;
            padding-left: 15px;
        }
        
        .archetype-card {
            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .archetype-name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .archetype-description {
            font-size: 18px;
            opacity: 0.95;
        }
        
        .characteristics {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        }
        
        .characteristic {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
        }
        
        .strengths-weaknesses {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .strength-item, .weakness-item {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #10B981;
        }
        
        .weakness-item {
            border-left-color: #F59E0B;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .item-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .score-bar {
            height: 6px;
            background: #E5E7EB;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .score-fill {
            height: 100%;
            background: #10B981;
            transition: width 0.3s ease;
        }
        
        .gap-analysis {
            background: #FEF3C7;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #F59E0B;
            margin-bottom: 30px;
        }
        
        .recommendations-grid {
            display: grid;
            gap: 20px;
        }
        
        .recommendation-card {
            background: #F0F9FF;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #0EA5E9;
        }
        
        .development-plan {
            background: #F0FDF4;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #10B981;
        }
        
        .phase {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #D1FAE5;
        }
        
        .phase:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .phase-title {
            font-weight: bold;
            color: #065F46;
            margin-bottom: 8px;
        }
        
        .phase-duration {
            color: #059669;
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .action-list {
            list-style: none;
        }
        
        .action-list li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
        }
        
        .action-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10B981;
            font-weight: bold;
        }
        
        .emotional-profile {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background: #F8FAFC;
            padding: 25px;
            border-radius: 12px;
        }
        
        .emotion-metric {
            text-align: center;
        }
        
        .emotion-score {
            font-size: 36px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 5px;
        }
        
        .emotion-label {
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #E5E7EB;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .disclaimer {
            background: #FEF2F2;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #F87171;
            margin-top: 30px;
            font-size: 12px;
            color: #991B1B;
        }
        
        @media print {
            .section {
                page-break-inside: avoid;
            }
            
            .archetype-card {
                page-break-inside: avoid;
            }
            
            .development-plan {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">TraderInsightsLab</div>
            <div class="subtitle">Raport Psihologic Personalizat pentru Trading</div>
            <div style="margin-top: 15px; color: #666; font-size: 14px;">
                Generat: ${generatedAt.toLocaleDateString('ro-RO')} | 
                Pentru: ${userContext.email} | 
                ID: ${sessionId.substring(0, 8)}
            </div>
        </div>

        <!-- Archetype Section -->
        <div class="section">
            <div class="archetype-card">
                <div class="archetype-name">${analysisResults.archetype.name}</div>
                <div class="archetype-description">${analysisResults.archetype.description}</div>
                <div class="characteristics">
                    ${analysisResults.archetype.characteristics.map(char => 
                        `<span class="characteristic">${char}</span>`
                    ).join('')}
                </div>
            </div>
        </div>

        <!-- Strengths and Weaknesses -->
        <div class="section">
            <h2 class="section-title">Puncte Forte și Zonele de Îmbunătățire</h2>
            <div class="strengths-weaknesses">
                <div>
                    <h3 style="color: #10B981; margin-bottom: 15px; font-size: 18px;">Puncte Forte</h3>
                    ${analysisResults.strengths.map(strength => `
                        <div class="strength-item">
                            <div class="item-title">${strength.category}</div>
                            <div class="item-description">${strength.description}</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${strength.score}%"></div>
                            </div>
                            <div style="text-align: right; font-size: 12px; margin-top: 5px; color: #10B981;">
                                ${strength.score}%
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h3 style="color: #F59E0B; margin-bottom: 15px; font-size: 18px;">Zone de Îmbunătățire</h3>
                    ${analysisResults.weaknesses.map(weakness => `
                        <div class="weakness-item">
                            <div class="item-title">${weakness.category}</div>
                            <div class="item-description">${weakness.description}</div>
                            <div style="margin-top: 10px;">
                                <strong>Risc:</strong> 
                                <span style="color: ${weakness.risk === 'high' ? '#DC2626' : weakness.risk === 'medium' ? '#F59E0B' : '#10B981'}">
                                    ${weakness.risk === 'high' ? 'Mare' : weakness.risk === 'medium' ? 'Mediu' : 'Mic'}
                                </span>
                            </div>
                            <div style="margin-top: 10px;">
                                <strong>Recomandări:</strong>
                                <ul style="margin-top: 5px; padding-left: 20px;">
                                    ${weakness.recommendations.map(rec => `<li style="margin: 3px 0;">${rec}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Gap Analysis -->
        <div class="section">
            <h2 class="section-title">Analiza Decalajului: Percepție vs. Realitate</h2>
            <div class="gap-analysis">
                <div style="margin-bottom: 20px;">
                    <strong>Cum te percepi:</strong>
                    <p style="margin-top: 5px;">${analysisResults.gapAnalysis.perception}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Ce relevă testul:</strong>
                    <p style="margin-top: 5px;">${analysisResults.gapAnalysis.reality}</p>
                </div>
                <div>
                    <strong>Puncte oarbe identificate:</strong>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        ${analysisResults.gapAnalysis.blindSpots.map(spot => 
                            `<li style="margin: 5px 0;">${spot}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Trading Recommendations -->
        <div class="section">
            <h2 class="section-title">Recomandări pentru Trading</h2>
            <div class="recommendations-grid">
                <div class="recommendation-card">
                    <strong>Stilul Optim:</strong> ${analysisResults.tradingRecommendations.optimalStyle}
                </div>
                <div class="recommendation-card">
                    <strong>Timeframe Recomandat:</strong> ${analysisResults.tradingRecommendations.timeframe}
                </div>
                <div class="recommendation-card">
                    <strong>Reguli de Risk Management:</strong>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        ${analysisResults.tradingRecommendations.riskManagement.map(rule => 
                            `<li style="margin: 3px 0;">${rule}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Development Plan -->
        <div class="section">
            <h2 class="section-title">Planul Tău de Dezvoltare</h2>
            <div class="development-plan">
                ${analysisResults.tradingRecommendations.developmentPlan.map(phase => `
                    <div class="phase">
                        <div class="phase-title">${phase.phase}</div>
                        <div class="phase-duration">Durata: ${phase.duration}</div>
                        <ul class="action-list">
                            ${phase.actions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Emotional Profile -->
        <div class="section">
            <h2 class="section-title">Profilul Emoțional</h2>
            <div class="emotional-profile">
                <div class="emotion-metric">
                    <div class="emotion-score">${analysisResults.emotionalProfile.riskTolerance}</div>
                    <div class="emotion-label">Toleranță la Risc</div>
                </div>
                <div class="emotion-metric">
                    <div class="emotion-score">${analysisResults.emotionalProfile.discipline}</div>
                    <div class="emotion-label">Disciplină</div>
                </div>
                <div style="grid-column: 1 / -1; margin-top: 20px;">
                    <div style="margin-bottom: 15px;">
                        <strong>Răspuns la Stres:</strong> ${analysisResults.emotionalProfile.stressResponse}
                    </div>
                    <div>
                        <strong>Stil de Decizie:</strong> ${analysisResults.emotionalProfile.decisionMaking}
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="margin-bottom: 10px;">
                <strong>TraderInsightsLab</strong> - Evaluare Psihologică pentru Traderi
            </div>
            <div>
                Pentru întrebări sau suport, contactează-ne la: support@traderinsightslab.com
            </div>
            
            <div class="disclaimer">
                <strong>Disclaimer:</strong> Acest raport reprezintă o analiză psihologică bazată pe răspunsurile tale la test. 
                Nu constituie sfaturi de investiții și nu garantează succesul în trading. Tranzacționarea implică riscuri 
                și poți pierde banii investiți. Consultă întotdeauna un consilier financiar înainte de a lua decizii de investiții.
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }
}

export const pdfGenerationService = new PDFGenerationService();