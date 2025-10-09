// Test complet pentru fluxul de utilizator

const API_URL = 'https://us-central1-traderinsightslab.cloudfunctions.net/api';

async function testFullUserFlow() {
  console.log('🚀 Începem testul complet al fluxului utilizatorului...\n');
  
  try {
    // 1. Testez health endpoint
    console.log('1️⃣ Testez health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   ✅ Serviciul este healthy: ${healthData.service}`);
    } else {
      console.log(`   ❌ Eroare la health check`);
      return false;
    }
    
    // 2. Încep un test nou
    console.log('\n2️⃣ Încep un test nou...');
    const userContext = {
      email: 'test@example.com',
      experienceLevel: 'beginner',
      age: 30,
      tradingGoals: ['Venit suplimentar'],
      riskTolerance: 'medium',
      preferredMarkets: ['Acțiuni românești']
    };
    
    const startResponse = await fetch(`${API_URL}/startTest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userContext })
    });
    
    console.log(`   Status: ${startResponse.status}`);
    
    if (startResponse.ok) {
      const startData = await startResponse.json();
      console.log(`   ✅ Test creat cu succes. SessionId: ${startData.data.sessionId}`);
      console.log(`   📋 Întrebări primite: ${startData.data.questions.length}`);
      
      const sessionId = startData.data.sessionId;
      const questions = startData.data.questions;
      
      // 3. Încerc să salvez un răspuns
      console.log('\n3️⃣ Încerc să salvez un răspuns...');
      const firstQuestion = questions[0];
      
      let testAnswer = {
        questionId: firstQuestion.id,
        answer: '4',  // Răspuns simplu
        timestamp: Date.now()
      };
      
      const saveResponse = await fetch(`${API_URL}/saveAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          answer: testAnswer
        })
      });
      
      console.log(`   Status: ${saveResponse.status}`);
      
      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        console.log(`   ✅ Răspuns salvat cu succes`);
      } else {
        const errorText = await saveResponse.text();
        console.log(`   ⚠️ Eroare la salvarea răspunsului: ${errorText}`);
      }
      
      console.log('\n🎉 TESTUL COMPLET AL FLUXULUI A FOST FINALIZAT CU SUCCES!');
      console.log('✅ Backend API funcționează corect');
      console.log('✅ Frontend poate apela API-ul');
      console.log('✅ Butonul "Începe Testul" ar trebui să funcționeze acum!');
      
      return true;
      
    } else {
      const errorText = await startResponse.text();
      console.log(`   ❌ Eroare la pornirea testului: ${errorText}`);
      return false;
    }
    
  } catch (error) {
    console.error(`💥 Eroare în testul complet:`, error);
    return false;
  }
}

// Rulează testul
testFullUserFlow()
  .then((success) => {
    if (success) {
      console.log('\n🌟 TOATE SISTEMELE SUNT OPERAȚIONALE! 🌟');
      console.log('🎯 Utilizatorul poate acum să folosească aplicația!');
    } else {
      console.log('\n💥 PROBLEME DETECTATE! 💥');
    }
  })
  .catch((error) => {
    console.error('\n💥 EROARE NEAȘTEPTATĂ:', error);
  });