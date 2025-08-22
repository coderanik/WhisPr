const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiGet(path: string, token?: string) {
  try {
    console.log(`Making GET request to: ${API_BASE}${path}`);
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
      console.error("API GET error:", errorData);
      throw errorData;
    }
    
    const data = await res.json();
    console.log(`GET response from ${path}:`, data);
    return data;
  } catch (error) {
    console.error(`Error in apiGet(${path}):`, error);
    throw error;
  }
}

export async function apiPost(path: string, data: any, token?: string) {
  try {
    console.log(`Making POST request to: ${API_BASE}${path}`, data);
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
      console.error("API POST error:", errorData);
      throw errorData;
    }
    
    const responseData = await res.json();
    console.log(`POST response from ${path}:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`Error in apiPost(${path}):`, error);
    throw error;
  }
} 