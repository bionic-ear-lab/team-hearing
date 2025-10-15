
export interface AuthResponse {
  id: number; 
  username: string;
  email: string;
  birthdate: string;
  gender: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Login failed");
  }
  const data = await res.json();
  console.log("Login response:", data); 
  return data;
}

export async function signup(username: string, email: string, password: string, birthdate: string, gender: string): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8080/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, birthdate, gender })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Signup failed");
  }
  const data = await res.json();
  console.log("Signup response:", data);  
  return data;
}

export async function validateToken(token: string): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8080/auth/validate", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error("Token validation failed");
  }
  return res.json();
}