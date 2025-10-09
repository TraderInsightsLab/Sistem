// Test script pentru a verifica conexiunea API
const API_URL = 'https://us-central1-traderinsightslab.cloudfunctions.net/api';

async function testStartTest() {
  console.log('Testing API connection...');
  
  const userContext = {
    email: 'test@example.com',
    experienceLevel: 'beginner',
    age: 30,
    tradingGoals: ['Venit suplimentar'],
    riskTolerance: 'medium',
    preferredMarkets: ['Acțiuni românești']
  };

  try {
    console.log('Sending request to:', `${API_URL}/startTest`);
    console.log('User context:', userContext);
    
    const response = await fetch(`${API_URL}/startTest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userContext }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success! Response data:', data);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Test health endpoint
async function testHealth() {
  try {
    console.log('\nTesting health endpoint...');
    const response = await fetch(`${API_URL}/health`);
    console.log('Health status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health response:', data);
    } else {
      const errorText = await response.text();
      console.log('Health error:', errorText);
    }
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Run tests
testHealth();
setTimeout(() => testStartTest(), 1000);