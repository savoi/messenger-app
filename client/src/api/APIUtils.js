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
      'Content-Type': 'application/json'
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

export async function getUser() {
  const response = await getWithJWT('/user');
  if (response.ok) {
    const jsonResponse =  await response.json();
    return jsonResponse['current_user'];
  } else {
    throw new Error('Error fetching user.');
  }
}

export async function getJson(url) {
  const response = await getWithJWT(url);
  if (response.ok) {
    const jsonResponse =  await response.json();
    return jsonResponse;
  } else {
    throw new Error('Error fetching data.');
  }
}

export async function postMessage(body, toUsername) {
  const data = {
    body: body,
    to_username: toUsername
  };
  const response = await postWithJWT('/messages', data);
  if (response.ok) {
    return response;
  } else {
    throw new Error("Error sending message.");
  }
}

export async function newConversation(usernames) {
  const data = {
    usernames: usernames
  };
  const response = await postWithJWT('/conversations', data);
  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  } else {
    throw new Error("Error starting new conversation.", responseJson);
  }
}
