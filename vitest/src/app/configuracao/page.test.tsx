import Configuracao from "@/app/configuracoes/page";
import { render, screen } from "@testing-library/react";

describe("Configuracao Page", () => {
  it("should content button 'Usuários e Permissões' and to be click", () => {
    const { getByText } = render(<Configuracao />);

    const button = screen.getByRole("heading", {
      name: "Usuários e Permissões",
    });
    expect(button).toBeInTheDocument();
    expect(getByText("Usuários e Permissões")).toBeInTheDocument();
  });
  it("should content button 'Gestão de Produtos' and to be click", () => {
    const { getByText } = render(<Configuracao />);

    const button = screen.getByRole("heading", { name: "Gestão de Produtos" });
    expect(button).toBeInTheDocument();
    expect(getByText("Gestão de Produtos")).toBeInTheDocument();
  });
  it("should content button 'Categorias de Produto' and to be click", () => {
    const { getByText } = render(<Configuracao />);

    const button = screen.getByRole("heading", {
      name: "Categorias de Produto",
    });
    expect(button).toBeInTheDocument();
    expect(getByText("Categorias de Produto")).toBeInTheDocument();
  });
});
