import Home from "@/app/page";
import { render } from "@testing-library/react";

describe("Home", () => {
  it("should render KPI cards", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Vendas Hoje")).toBeInTheDocument();
    expect(getByText("Pedidos Hoje")).toBeInTheDocument();
    expect(getByText("Faturamento Mensal")).toBeInTheDocument();
    expect(getByText("Alertas Estoque")).toBeInTheDocument();
    expect(getByText("Produtos em baixa")).toBeInTheDocument();
  });
  it("should click on New Order button", () => {
    const { getByText } = render(<Home />);
    const button = getByText("Novo Pedido");
    expect(button).toBeInTheDocument();
    button.click();
    expect(getByText("Novo Pedido")).toBeInTheDocument();
  });
  it("should click on Add Stock button", () => {
    const { getByText } = render(<Home />);
    const button = getByText("Add Estoque");
    expect(button).toBeInTheDocument();
    button.click();
    expect(getByText("Add Estoque")).toBeInTheDocument();
  });
  it("should click on Novo Cliente button", () => {
    const { getByText } = render(<Home />);
    const button = getByText("Novo Cliente");
    expect(button).toBeInTheDocument();
    button.click();
    expect(getByText("Novo Cliente")).toBeInTheDocument();
  });
  it("should click on Relatórios button", () => {
    const { getByText } = render(<Home />);
    const button = getByText("Relatórios");
    expect(button).toBeInTheDocument();
    button.click();
    expect(getByText("Relatórios")).toBeInTheDocument();
  });
});
