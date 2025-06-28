import { BASE_URL } from "../config";
import { getAccessToken } from "../utils/auth";

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN : `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
};

export async function getRegister({ name, email, password }) {
  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  const response = await fetchResponse.json();
  if (!fetchResponse.ok) {
    throw new Error(response.message);
  }
  return response;
}

export async function getLogin({ email, password }) {
  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const response = await fetchResponse.json();
  if (!fetchResponse.ok) {
    throw new Error(response.message);
  }
  return response;

}

export async function getAllStories() {
  const accessToken = getAccessToken();
  const fetchResponse = await fetch(ENDPOINTS.STORIES, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response = await fetchResponse.json();
  if (!fetchResponse.ok) {
    throw new Error(response.message);
  }
  return response;

}

export async function postStory(formData) {
  const response = await fetch(ENDPOINTS.STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData
  })
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}