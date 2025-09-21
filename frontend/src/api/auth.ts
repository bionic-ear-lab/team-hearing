export async function signup(username: string, email: string, password: string) {
  const res = await fetch("http://localhost:8080/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
}
