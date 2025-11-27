const http = require('http');
const https = require('https');

class HTTPTester {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  async get(path) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseURL}${path}`;
      const client = url.startsWith('https') ? https : http;

      client.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            url,
          });
        });
      }).on('error', (err) => reject(err));
    });
  }

  async checkStatus(path, expectedStatus = 200) {
    const response = await this.get(path);
    console.log(`${path}: ${response.status}`);
    return response.status === expectedStatus;
  }

  async checkContent(path, expectedText) {
    const response = await this.get(path);
    const hasText = response.body.includes(expectedText);
    console.log(`${path}: contains "${expectedText}" - ${hasText ? 'YES' : 'NO'}`);
    return hasText;
  }
}

async function runTests() {
  const tester = new HTTPTester();
  let allPassed = true;

  console.log('🚀 Running HTTP E2E Tests...\n');

  // Test 1: Home page loads (allow redirect 307 or 200)
  const homeResp = await tester.get('/');
  const homeOk = [200, 307].includes(homeResp.status);
  console.log(`/ : ${homeResp.status}`);
  if (!homeOk) {
    console.log('❌ Home page failed');
    allPassed = false;
  }

  // Test 2: Auth pages load
  const signinStatus = await tester.checkStatus('/auth/signin', 200);
  if (!signinStatus) { allPassed = false; console.log('❌ Signin page failed'); }

  const signupStatus = await tester.checkStatus('/auth/signup', 200);
  if (!signupStatus) { allPassed = false; console.log('❌ Signup page failed'); }

  // Test 3: Check content on auth pages (look for email input fields)
  const signinContent = await tester.checkContent('/auth/signin', 'type="email"');
  if (!signinContent) { console.log('❌ Signin page missing email input'); allPassed = false; }

  const signupContent = await tester.checkContent('/auth/signup', 'type="email"');
  if (!signupContent) { console.log('❌ Signup page missing email input'); allPassed = false; }

  // Test 4: Check navigation/home content
  const homeContent = await tester.checkContent('/', 'HHDAO');
  if (!homeContent) { console.log('❌ Home page missing expected content'); allPassed = false; }

  console.log('\n📊 Test Summary:');
  console.log(`Home Page: ${homeOk ? '✅' : '❌'}`);
  console.log(`SignIn Page: ${signinStatus && signinContent ? '✅' : '❌'}`);
  console.log(`SignUp Page: ${signupStatus && signupContent ? '✅' : '❌'}`);
  console.log(`Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  return allPassed;
}

if (require.main === module) {
  runTests().then((success) => process.exit(success ? 0 : 1)).catch((err) => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
}

module.exports = { HTTPTester, runTests };
