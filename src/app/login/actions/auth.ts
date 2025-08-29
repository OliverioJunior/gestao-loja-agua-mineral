import { redirect } from "next/navigation";
import { toast } from "sonner";

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
      toast.error(data.message || "Login failed", {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  } catch (err) {
    console.error("Signin error:", err);
    throw err;
  }
}
