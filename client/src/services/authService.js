export const loginUser = async (data) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));

  return result;
};
