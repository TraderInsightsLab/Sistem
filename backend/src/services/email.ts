import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendReportParams {
  to: string;
  sessionId: string;
  archetype: string;
  pdfBuffer: Buffer;
}

export class EmailService {
  
  async sendReport(params: SendReportParams): Promise<void> {
    try {
      const { to, sessionId, archetype, pdfBuffer } = params;
      
      console.log(`Sending report email to: ${to}`);
      
      const msg = {
        to,
        from: {
          email: 'reports@traderinsightslab.com',
          name: 'TraderInsightsLab'
        },
        subject: 'Raportul tău TraderInsightsLab este gata! 📊',
        html: this.generateEmailHTML(archetype, sessionId),
        text: this.generateEmailText(archetype, sessionId),
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: `TraderInsightsLab_Raport_${sessionId.substring(0, 8)}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      await sgMail.send(msg);
      console.log(`Report email sent successfully to: ${to}`);

    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  async sendWelcomeEmail(email: string, sessionId: string): Promise<void> {
    try {
      const msg = {
        to: email,
        from: {
          email: 'welcome@traderinsightslab.com',
          name: 'TraderInsightsLab'
        },
        subject: 'Bun venit la TraderInsightsLab! Testul tău a început 🎯',
        html: this.generateWelcomeHTML(sessionId),
        text: this.generateWelcomeText(sessionId)
      };

      await sgMail.send(msg);
      console.log(`Welcome email sent to: ${email}`);

    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email failure
    }
  }

  private generateEmailHTML(archetype: string, sessionId: string): string {
    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raportul tău TraderInsightsLab</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .archetype-highlight {
            background: #EBF8FF;
            border: 2px solid #3B82F6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .archetype-title {
            font-size: 24px;
            font-weight: bold;
            color: #1D4ED8;
            margin-bottom: 10px;
        }
        .features {
            background: #F0FDF4;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .feature-item:last-child {
            margin-bottom: 0;
        }
        .checkmark {
            color: #10B981;
            font-weight: bold;
            margin-right: 10px;
            font-size: 18px;
        }
        .cta-button {
            display: inline-block;
            background: #10B981;
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background: #F8FAFC;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #E5E7EB;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: #3B82F6;
            text-decoration: none;
            margin: 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TraderInsightsLab</div>
            <div>Raportul tău psihologic este gata!</div>
        </div>
        
        <div class="content">
            <h1 style="color: #1F2937; margin-bottom: 20px;">Felicitări! 🎉</h1>
            
            <p>Analiza ta psihologică este completă și raportul personalizat te așteaptă în atașament.</p>
            
            <div class="archetype-highlight">
                <div class="archetype-title">Profilul tău: ${archetype}</div>
                <p style="color: #4B5563; margin: 0;">
                    Descoperă în detaliu ce înseamnă acest profil și cum te poate ajuta în trading.
                </p>
            </div>
            
            <h2 style="color: #1F2937; margin-top: 30px;">Ce vei găsi în raport:</h2>
            
            <div class="features">
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Analiza detaliată a personalității tale de trader</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Punctele forte și zonele de îmbunătățire identificate</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Comparația între percepție și realitate (analiza decalajului)</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Recomandări personalizate pentru stilul de trading</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Plan de dezvoltare pe faze pentru următoarele 3-6 luni</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✓</span>
                    <span>Strategii de risk management adaptate profilului tău</span>
                </div>
            </div>
            
            <h3 style="color: #1F2937;">Pași următori:</h3>
            <ol style="color: #4B5563; padding-left: 20px; margin-bottom: 30px;">
                <li>Descarcă și studiază raportul PDF atașat</li>
                <li>Identifică primele 2-3 recomandări pe care vrei să le implementezi</li>
                <li>Începe cu primul pas din planul de dezvoltare</li>
                <li>Păstrează raportul pentru referință viitoare</li>
            </ol>
            
            <p style="background: #FEF3C7; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                <strong>💡 Tip:</strong> Pentru rezultate optime, revizuiește raportul după 30 de zile și 
                evaluează progresul făcut în implementarea recomandărilor.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Mulțumim pentru încrederea acordată!</strong></p>
            <p>Echipa TraderInsightsLab</p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p>Ai întrebări? Răspunde la acest email sau contactează-ne:</p>
                <p>📧 support@traderinsightslab.com</p>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #9CA3AF;">
                <p>ID Sesiune: ${sessionId.substring(0, 8)} | Generat: ${new Date().toLocaleDateString('ro-RO')}</p>
                <p>© 2024 TraderInsightsLab. Toate drepturile rezervate.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateEmailText(archetype: string, sessionId: string): string {
    return `
TRADERINSIGHTSLAB - RAPORTUL TĂU ESTE GATA!

Felicitări! Analiza ta psihologică este completă.

PROFILUL TĂU: ${archetype}

CE CONȚINE RAPORTUL:
✓ Analiza detaliată a personalității tale de trader
✓ Punctele forte și zonele de îmbunătățire identificate  
✓ Comparația între percepție și realitate (analiza decalajului)
✓ Recomandări personalizate pentru stilul de trading
✓ Plan de dezvoltare pe faze pentru următoarele 3-6 luni
✓ Strategii de risk management adaptate profilului tău

PAȘI URMĂTORI:
1. Descarcă și studiază raportul PDF atașat
2. Identifică primele 2-3 recomandări pe care vrei să le implementezi
3. Începe cu primul pas din planul de dezvoltare
4. Păstrează raportul pentru referință viitoare

Pentru întrebări: support@traderinsightslab.com

Mulțumim pentru încrederea acordată!
Echipa TraderInsightsLab

ID Sesiune: ${sessionId.substring(0, 8)}
© 2024 TraderInsightsLab
    `;
  }

  private generateWelcomeHTML(sessionId: string): string {
    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun venit la TraderInsightsLab</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .content {
            padding: 40px 30px;
        }
        .footer {
            background: #F8FAFC;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bun venit la TraderInsightsLab! 🎯</h1>
            <p>Testul tău psihologic a început</p>
        </div>
        
        <div class="content">
            <p>Mulțumim că ai ales TraderInsightsLab pentru evaluarea profilului tău de trader!</p>
            
            <p>Testul tău este în curs de procesare. Vei primi raportul complet pe email după finalizarea plății.</p>
            
            <p>Între timp, îți recomandăm să:</p>
            <ul>
                <li>Verifici folderul de spam pentru email-urile noastre</li>
                <li>Adaugi adresa noastră la contacte</li>
                <li>Te pregătești să implementezi recomandările din raport</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>ID Sesiune: ${sessionId.substring(0, 8)}</p>
            <p>© 2024 TraderInsightsLab</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateWelcomeText(sessionId: string): string {
    return `
Bun venit la TraderInsightsLab!

Testul tău psihologic a început. Vei primi raportul complet pe email după finalizarea plății.

ID Sesiune: ${sessionId.substring(0, 8)}

© 2024 TraderInsightsLab
    `;
  }
}

export const emailService = new EmailService();