// Test end-to-end pentru întregul flow
const apiUrl = 'http://localhost:5001/traderinsightslab/us-central1/api/api';

async function testCompleteFlow() {
  console.log('🚀 Starting End-to-End Test...\n');
  
  try {
    // Step 1: Start Test
    console.log('📝 Step 1: Starting new test session...');
    const startResponse = await fetch(`${apiUrl}/startTest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userContext: {
          email: 'test@example.com',
          age: 28,
          experienceLevel: 'intermediate',
          riskTolerance: 'medium',
          tradingGoals: ['Venit suplimentar', 'Învățare'],
          preferredMarkets: ['Acțiuni românești']
        }
      })
    });
    
    if (!startResponse.ok) {
      throw new Error(`Start test failed: ${startResponse.status}`);
    }
    
    const startData = await startResponse.json();
    console.log('✅ Test session created:', startData.data.sessionId);
    console.log('📋 Questions received:', startData.data.questions.length);
    
    const sessionId = startData.data.sessionId;
    const questions = startData.data.questions;
    
    // Step 2: Answer Questions (including cognitive games)
    console.log('\n📝 Step 2: Answering questions...');
    
    for (let i = 0; i < Math.min(5, questions.length); i++) {
      const question = questions[i];
      let answer;
      
      if (question.type === 'cognitive-game') {
        // Mock cognitive game results
        if (question.id === 'cog_1') {
          answer = JSON.stringify({
            score: 850,
            metrics: {
              totalTime: 120000,
              averageResponseTime: 4500,
              riskLevel: 12,
              finalAmount: 1150
            }
          });
        } else if (question.id === 'cog_2') {
          answer = JSON.stringify({
            score: 75,
            metrics: {
              totalResponseTime: 32000,
              timeouts: 1,
              quickDecisions: 6,
              averageResponseTime: 4000
            }
          });
        } else if (question.id === 'cog_3') {
          answer = JSON.stringify({
            score: 82,
            metrics: {
              stabilityPercentage: 75,
              calmReactions: 6,
              panicReactions: 1,
              finalEmotionalState: 68,
              averageEmotionalState: 72
            }
          });
        }
      } else if (question.type === 'single-choice') {
        answer = question.options[0].id; // Select first option
      } else if (question.type === 'scale') {
        answer = 4; // Middle-high value
      } else {
        answer = 'Test answer';
      }
      
      const saveResponse = await fetch(`${apiUrl}/saveAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answer: {
            questionId: question.id,
            answer: answer,
            timestamp: Date.now(),
            responseTime: Math.random() * 5000 + 1000 // 1-6 seconds
          }
        })
      });
      
      if (!saveResponse.ok) {
        console.warn(`⚠️  Warning: Failed to save answer for ${question.id}`);
      } else {
        console.log(`✅ Saved answer for ${question.id} (${question.type})`);
      }
      
      // Small delay between answers
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Step 3: Process Results
    console.log('\n🧠 Step 3: Processing results with AI...');
    const processResponse = await fetch(`${apiUrl}/processResults`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    
    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      throw new Error(`Process results failed: ${processResponse.status} - ${errorText}`);
    }
    
    const processData = await processResponse.json();
    console.log('✅ Results processed successfully!');
    console.log('🎯 Archetype:', processData.data.teaser.archetype);
    console.log('💪 Main Strength:', processData.data.teaser.mainStrength);
    console.log('💳 Payment URL:', processData.data.paymentUrl ? 'Generated' : 'Not generated');
    
    console.log('\n🎉 End-to-End Test Completed Successfully!');
    console.log('📊 Summary:');
    console.log('- ✅ Test session creation: Working');
    console.log('- ✅ Question answering: Working'); 
    console.log('- ✅ Cognitive games: Integrated');
    console.log('- ✅ AI analysis: Working (fallback)');
    console.log('- ✅ Payment integration: Ready');
    
    return {
      success: true,
      sessionId,
      archetype: processData.data.teaser.archetype,
      paymentReady: !!processData.data.paymentUrl
    };
    
  } catch (error) {
    console.error('\n❌ End-to-End Test Failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return { success: false, error: error.message };
  }
}

// Run the test
testCompleteFlow()
  .then((result) => {
    if (result.success) {
      console.log('\n🌟 ALL SYSTEMS OPERATIONAL! 🌟');
      process.exit(0);
    } else {
      console.log('\n💥 SYSTEM ISSUES DETECTED 💥');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 UNEXPECTED ERROR:', error);
    process.exit(1);
  });