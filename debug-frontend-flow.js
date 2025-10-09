// Debug script pentru a testa exact fluxul frontend

const API_URL = 'https://us-central1-traderinsightslab.cloudfunctions.net/api';

async function debugFrontendFlow() {
  console.log('🔍 DEBUG: Testez exact fluxul frontend...\n');
  
  // Simulez exact ce face frontend-ul
  const userContext = {
    email: 'test@example.com',
    experienceLevel: 'beginner',
    age: 25,
    tradingGoals: ['Venit suplimentar', 'Învățare'],
    riskTolerance: 'medium',
    preferredMarkets: ['Acțiuni românești']
  };

  console.log('📋 User context care va fi trimis:');
  console.log(JSON.stringify(userContext, null, 2));
  
  try {
    console.log('\n🚀 Trimit request exact ca frontend-ul...');
    console.log(`URL: ${API_URL}/startTest`);
    
    const response = await fetch(`${API_URL}/startTest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userContext }),
    });
    
    console.log(`\n📊 Response status: ${response.status}`);
    console.log('📊 Response headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`);
    }
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! Răspuns primit:');
      console.log(`   SessionId: ${data.data.sessionId}`);
      console.log(`   Questions count: ${data.data.questions.length}`);
      console.log('   Sample question:', data.data.questions[0]);
      
      // Testez și saveAnswer
      console.log('\n🧪 Testez saveAnswer...');
      const saveResponse = await fetch(`${API_URL}/saveAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: data.data.sessionId,
          answer: {
            questionId: data.data.questions[0].id,
            answer: '4',
            timestamp: Date.now()
          }
        }),
      });
      
      console.log(`   SaveAnswer status: ${saveResponse.status}`);
      if (saveResponse.ok) {
        console.log('   ✅ SaveAnswer funcționează!');
      } else {
        const saveError = await saveResponse.text();
        console.log('   ❌ SaveAnswer error:', saveError);
      }
      
    } else {
      const errorText = await response.text();
      console.log('\n❌ EROARE! Response body:');
      console.log(errorText);
    }
    
  } catch (error) {
    console.error('\n💥 EXCEPTION:', error.message);
  }
}

debugFrontendFlow();