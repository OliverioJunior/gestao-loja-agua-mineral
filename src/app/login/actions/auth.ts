import { redirect } from "next/navigation";

export async function signin(formData: FormData) {
  // Validate form fields

  const [email, password] = [
    formData.get("email") as string,
    formData.get("password") as string,
  ];

  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      redirect("/");
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Signin error:", err);
    throw err;
  }
}
