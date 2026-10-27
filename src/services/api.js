const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPostById(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post #${id}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserById(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user #${userId}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPostComments(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}/comments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post #${id}: ${response.statusText}`);
  }
  return response.json();
}
