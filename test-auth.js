// Simple test script to verify JWT authentication flow
const BASE_URL = 'http://localhost:3004';

async function testAuthFlow() {
  console.log('🔐 Testing JWT Authentication Flow...\n');
  
  try {
    // Test 1: Login with default admin credentials
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@blog.ia',
        password: 'admin123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('  - User:', loginData.user.username);
    console.log('  - Token preview:', loginData.token.substring(0, 20) + '...');
    
    const token = loginData.token;
    
    // Test 2: Use token to access protected route
    console.log('\n2. Testing protected route with token...');
    const protectedResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!protectedResponse.ok) {
      throw new Error(`Protected route failed: ${protectedResponse.status} ${protectedResponse.statusText}`);
    }
    
    const userData = await protectedResponse.json();
    console.log('✅ Protected route access successful!');
    console.log('  - User from token:', userData.user.username);
    
    // Test 3: Test posts endpoint (should work now)
    console.log('\n3. Testing posts endpoint with token...');
    const postsResponse = await fetch(`${BASE_URL}/api/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!postsResponse.ok) {
      throw new Error(`Posts endpoint failed: ${postsResponse.status} ${postsResponse.statusText}`);
    }
    
    const postsData = await postsResponse.json();
    console.log('✅ Posts endpoint access successful!');
    console.log('  - Posts count:', postsData.posts?.length || 0);
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly (not imported)
if (require.main === module) {
  testAuthFlow();
}

module.exports = { testAuthFlow };