"use client";
import { Button, Input, Label } from "@/shared/components/ui";
import { Mail, Lock } from "lucide-react";
import { signin } from "../actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function SigninForm() {
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    try {
      router.prefetch("/");
      const [email, password] = [
        formData.get("email") as string,
        formData.get("password") as string,
      ];
      if (!email || !password) {
        toast.error("Email e senha devem ser fornecidos", {
          style: {
            background: "red",
            color: "white",
          },
        });
      }
      const result = await signin(formData);
      if (result) {
        toast.message("Login efetuado com sucesso", {
          style: {
            background: "green",
            color: "white",
          },
        });
        router.push("/");
        return;
      }
      toast.message("Algo deu errado", {
        style: {
          background: "red",
          color: "white",
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: {
            background: "red",
            color: "white",
          },
        });
        return;
      }
      toast.error("Error interno do servidor", {
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }
  };

  return (
    <form action={handleLogin} className="space-y-6">
      {/* Campo Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            required
          />
        </div>
      </div>

      {/* Campo Senha */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Senha
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={"password"}
            placeholder="Digite sua senha"
            className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            required
          />
        </div>
      </div>

      {/* Botão de Login */}
      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium transition-colors"
      >
        {"Entrar"}
      </Button>
    </form>
  );
}
