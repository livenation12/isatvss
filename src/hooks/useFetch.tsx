interface RequestMethod {
  body?: any; // Accept any type for flexibility (Object or FormData)
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  credentials?: 'same-origin' | 'include' | 'omit'; // Explicitly list allowed values
  headers?: HeadersInit;
}

export default async function useFetch(path: string, requestOptions: RequestMethod) {
  const defaultRequestOptions: RequestInit = {
    credentials: 'include', // Default to include credentials
  };

  const finalRequestOptions: RequestInit = {
    ...defaultRequestOptions,
    ...requestOptions,
    headers: {
      ...defaultRequestOptions.headers,
      ...(requestOptions.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), // Only set JSON header if not FormData
      ...requestOptions.headers,
    },
    body: requestOptions.body instanceof FormData
      ? requestOptions.body
      : JSON.stringify(requestOptions.body),
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_API_URL}${path}`, finalRequestOptions);
    // Parse the response body as JSON
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    // Return the error response data if available
    return Promise.reject(error instanceof Error ? JSON.parse(error.message) : error);
  }
}
