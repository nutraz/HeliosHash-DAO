import { check, sleep } from 'k6';
import http from 'k6/http';

// Set the base URL via environment variable, e.g. BASE_URL=https://staging.yourapp.com
const BASE_URL = __ENV.BASE_URL || 'https://staging.yourapp.com';

export let options = {
  vus: 50, // virtual users
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
    http_req_failed: ['rate<0.01'],    // <1% errors
  },
};

export default function () {
  // 1. High-Traffic Query Call: GET /api/proposals/active
  let queryRes = http.get(`${BASE_URL}/api/proposals/active`);
  check(queryRes, {
    'query status is 200': (r) => r.status === 200,
    'query body is not empty': (r) => !!r.body && r.body.length > 2,
  });

  // 2. Critical Update Call: POST /api/dao/vote
  // Simulate a vote payload (customize as needed)
  const votePayload = JSON.stringify({
    proposalId: 'test-proposal-id',
    vote: 'yes',
    user: `user-${__VU}-${__ITER}`,
  });
  let updateRes = http.post(
    `${BASE_URL}/api/dao/vote`,
    votePayload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(updateRes, {
    'update status is 200': (r) => r.status === 200,
    'update response ok': (r) => r.body && r.body.includes('success'),
  });

  sleep(1); // Simulate user think time
}
