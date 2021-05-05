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

function getAuthFetchOptions(data) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };
}

async function handleBadAuthResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    throw new Error("Server unreachable.");
  }
  if (contentType && contentType.indexOf("application/json") !== -1) {
    throw await response.json();
  } else {
    throw new Error("Server error.");
  }
}

export async function makeAuthCall(url, data) {
  const response = await fetch(url, getAuthFetchOptions(data));
  const responseJson = await response.json();
  if (!response.ok) {
    if (responseJson['message']) {
      throw new Error(responseJson['message']);
    }
    return handleBadAuthResponse(response);
  } else {
    return responseJson;
  }
}
