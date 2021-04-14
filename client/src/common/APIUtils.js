function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function makeRequestWithJWT(apiEndpoint) {
  const options = {
    method: 'post',
    credentials: 'same-origin',
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
  };
  const response = await fetch(apiEndpoint, options);
  const result = await response.json();
  return result;
}
