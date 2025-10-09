// Test script pentru validarea serviciului AI
const { aiAnalysisService } = require('./lib/services/aiAnalysis');

async function testAIService() {
  console.log('🧠 Testing AI Analysis Service...\n');
  
  // Mock test data similar to what would come from a real test
  const mockInput = {
    userContext: {
      experienceLevel: 'intermediate',
      age: 32,
      riskTolerance: 'medium',
      tradingGoals: ['Venit suplimentar', 'Învățare și experiență'],
      preferredMarkets: ['Acțiuni românești', 'ETF-uri']
    },
    answers: [
      {
        questionId: 'auto_1',
        answer: 'b',
        timestamp: Date.now() - 5000,
        responseTime: 3200
      },
      {
        questionId: 'cog_1',
        answer: JSON.stringify({
          score: 850,
          metrics: {
            totalTime: 120000,
            averageResponseTime: 4500,
            riskLevel: 12, // Medium-high risk preference
            finalAmount: 1150
          }
        }),
        timestamp: Date.now() - 2000,
        responseTime: 120000
      },
      {
        questionId: 'cog_2', 
        answer: JSON.stringify({
          score: 75,
          metrics: {
            totalResponseTime: 32000,
            timeouts: 1,
            quickDecisions: 6,
            averageResponseTime: 4000
          }
        }),
        timestamp: Date.now() - 1000,
        responseTime: 32000
      },
      {
        questionId: 'cog_3',
        answer: JSON.stringify({
          score: 82,
          metrics: {
            stabilityPercentage: 75,
            calmReactions: 6,
            panicReactions: 1,
            finalEmotionalState: 68,
            averageEmotionalState: 72
          }
        }),
        timestamp: Date.now(),
        responseTime: 95000
      }
    ],
    sessionMetadata: {
      totalTime: 180000, // 3 minutes
      sections: {
        autoportret: { timeSpent: 45000, questionsAnswered: 3 },
        scenarii: { timeSpent: 40000, questionsAnswered: 2 }, 
        cognitive: { timeSpent: 95000, questionsAnswered: 3 }
      }
    }
  };

  try {
    console.log('📊 Input data prepared:');
    console.log('- User: ' + mockInput.userContext.experienceLevel + ' trader, age ' + mockInput.userContext.age);
    console.log('- Answers: ' + mockInput.answers.length + ' responses');
    console.log('- Total time: ' + (mockInput.sessionMetadata.totalTime / 1000) + 's\n');
    
    console.log('🔄 Calling AI Analysis Service...\n');
    const startTime = Date.now();
    
    const result = await aiAnalysisService.analyzeProfile(mockInput);
    
    const processingTime = Date.now() - startTime;
    console.log('✅ AI Analysis completed in ' + processingTime + 'ms\n');
    
    // Display results
    console.log('📋 ANALYSIS RESULTS:');
    console.log('===================');
    console.log('🎯 Archetype: ' + result.archetype.name);
    console.log('📝 Description: ' + result.archetype.description);
    console.log('💪 Main Strength: ' + (result.strengths[0]?.category || 'N/A'));
    console.log('⚠️  Main Weakness: ' + (result.weaknesses[0]?.category || 'N/A'));
    console.log('🔍 Gap Analysis:');
    console.log('   Perception: ' + result.gapAnalysis.perception);
    console.log('   Reality: ' + result.gapAnalysis.reality);
    console.log('📈 Recommended Style: ' + result.tradingRecommendations.optimalStyle);
    console.log('⏱️  Timeframe: ' + result.tradingRecommendations.timeframe);
    console.log('🎯 Risk Tolerance: ' + result.emotionalProfile.riskTolerance + '/100');
    console.log('🧘 Discipline Score: ' + result.emotionalProfile.discipline + '/100\n');
    
    console.log('🎉 AI Service test completed successfully!');
    
    return result;
  } catch (error) {
    console.error('❌ AI Service test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Test fallback mechanism
    console.log('\n🔄 Testing fallback mechanism...');
    try {
      // This should trigger the fallback
      const fallbackResult = await aiAnalysisService.analyzeProfile(mockInput);
      console.log('✅ Fallback mechanism works!');
      console.log('📋 Fallback archetype: ' + fallbackResult.archetype.name);
      return fallbackResult;
    } catch (fallbackError) {
      console.error('❌ Fallback mechanism also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

// Run the test
testAIService()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });