function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function makeRequestWithJWT(method, apiEndpoint, postData) {
  const options = {
    method: method,
    credentials: 'same-origin',
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    }
  };
  if (postData) {
    options['body'] = JSON.stringify(postData);
  }
  return await fetch(apiEndpoint, options);
}

export async function getWithJWT(apiEndpoint) {
  return await makeRequestWithJWT('get', apiEndpoint, null);
}

export async function postWithJWT(apiEndpoint, postData) {
  return await makeRequestWithJWT('post', apiEndpoint, postData);
}
