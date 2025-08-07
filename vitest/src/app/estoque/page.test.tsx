import Estoque from "@/app/estoque/page";
import { FiltrosPesquisa } from "@/layout/estoque/FiltrosPesquisa";
import { IProduto, ProdutoRow } from "@/layout/estoque/ProdutoRow";
import { TabelaProdutos } from "@/layout/estoque/TabelaProdutos";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Estoque Page", () => {
  const mockSetSearchTerm = vitest.fn();
  const mockSetFilterStatus = vitest.fn();
  it("should render the estoque page", () => {
    const { getByText } = render(<Estoque />);
    expect(getByText("Estoque")).toBeInTheDocument();
  });
  it("should click in button onDelete the estoque page", () => {
    render(<Estoque />);
    const button = screen.getAllByRole("button", { name: "Delete" });
    expect(button[0]).toBeInTheDocument();
    button[0].click();
  });
  it("should click in button onEdit the estoque page", () => {
    render(<Estoque />);
    const button = screen.getAllByRole("button", { name: "Edit" });
    expect(button[0]).toBeInTheDocument();
    button[0].click();
  });
  it("should click in button onView the estoque page", () => {
    render(<Estoque />);
    const button = screen.getAllByRole("button", { name: "View" });
    expect(button[0]).toBeInTheDocument();
    button[0].click();
  });
  it("should search for products", () => {
    render(
      <FiltrosPesquisa
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        setFilterStatus={mockSetFilterStatus}
      />
    );
    const searchInput = screen.getByPlaceholderText("Buscar produtos...");
    fireEvent.change(searchInput, { target: { value: "Água" } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith("Água");
  });
  it("should filter products by status", () => {
    render(
      <FiltrosPesquisa
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        setFilterStatus={mockSetFilterStatus}
      />
    );
    const filterSelect = screen.getByRole("combobox");
    fireEvent.click(filterSelect);

    const statusOption = screen.getByText("Em estoque");
    fireEvent.click(statusOption);

    expect(mockSetFilterStatus).toHaveBeenCalledWith("ok");
  });
  describe("ProdutoRow", () => {
    it("should return status default when without status", () => {
      const onDelete = vitest.fn();
      const onEdit = vitest.fn();
      const onView = vitest.fn();
      render(
        <ProdutoRow
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          produto={{
            id: 1,
            nome: "Água Mineral",
            categoria: "Hidráulica",
            estoque: 100,
            minimo: 10,
            preco: 10.0,
            status: "",
            ultimaMovimentacao: "2023-01-01",
          }}
        />
      );
      const statusBadge = screen.getByText("Sem estoque");
      expect(statusBadge).toBeInTheDocument();
    });
    it("should click in function delete in ProdutoRow", () => {
      const onDelete = vitest.fn();
      const onEdit = vitest.fn();
      const onView = vitest.fn();
      render(
        <ProdutoRow
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          produto={{
            id: 1,
            nome: "Água Mineral",
            categoria: "Hidráulica",
            estoque: 100,
            minimo: 10,
            preco: 10.0,
            status: "",
            ultimaMovimentacao: "2023-01-01",
          }}
        />
      );

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledWith({
        id: 1,
        nome: "Água Mineral",
        categoria: "Hidráulica",
        estoque: 100,
        minimo: 10,
        preco: 10.0,
        status: "",
        ultimaMovimentacao: "2023-01-01",
      });
    });
    it("should click in function onEdit in ProdutoRow", () => {
      const onDelete = vitest.fn();
      const onEdit = vitest.fn();
      const onView = vitest.fn();
      render(
        <ProdutoRow
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          produto={{
            id: 1,
            nome: "Água Mineral",
            categoria: "Hidráulica",
            estoque: 100,
            minimo: 10,
            preco: 10.0,
            status: "",
            ultimaMovimentacao: "2023-01-01",
          }}
        />
      );

      const editButton = screen.getByRole("button", { name: "Edit" });
      fireEvent.click(editButton);
      expect(onEdit).toHaveBeenCalledWith({
        id: 1,
        nome: "Água Mineral",
        categoria: "Hidráulica",
        estoque: 100,
        minimo: 10,
        preco: 10.0,
        status: "",
        ultimaMovimentacao: "2023-01-01",
      });
    });
    it("should click in function onView in ProdutoRow", () => {
      const onDelete = vitest.fn();
      const onEdit = vitest.fn();
      const onView = vitest.fn();
      render(
        <ProdutoRow
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          produto={{
            id: 1,
            nome: "Água Mineral",
            categoria: "Hidráulica",
            estoque: 100,
            minimo: 10,
            preco: 10.0,
            status: "",
            ultimaMovimentacao: "2023-01-01",
          }}
        />
      );

      const onViewButton = screen.getByRole("button", { name: "View" });
      fireEvent.click(onViewButton);
      expect(onView).toHaveBeenCalledWith({
        id: 1,
        nome: "Água Mineral",
        categoria: "Hidráulica",
        estoque: 100,
        minimo: 10,
        preco: 10.0,
        status: "",
        ultimaMovimentacao: "2023-01-01",
      });
    });
  });
  describe("TabelaProdutos", () => {
    const produtosMock = [
      {
        id: 1,
        nome: "Água Mineral",
        categoria: "Hidráulica",
        estoque: 100,
        minimo: 10,
        preco: 10.0,
        status: "",
        ultimaMovimentacao: "2023-01-01",
      },
    ];
    const onDelete = vitest.fn();
    const onEdit = vitest.fn();
    const onView = vitest.fn();
    it("should render table with products", () => {
      render(
        <TabelaProdutos
          produtos={produtosMock}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      );
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
    it("should call onDelete when click in delete button", () => {
      render(
        <TabelaProdutos
          produtos={produtosMock}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      );
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledWith(produtosMock[0]);
    });
    it("should call onEdit when click in edit button", () => {
      render(
        <TabelaProdutos
          produtos={produtosMock}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      );
      const editButton = screen.getByRole("button", { name: "Edit" });
      fireEvent.click(editButton);
      expect(onEdit).toHaveBeenCalledWith(produtosMock[0]);
    });
    it("should call onView when click in view button", () => {
      render(
        <TabelaProdutos
          produtos={produtosMock}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      );
      const viewButton = screen.getByRole("button", { name: "View" });
      fireEvent.click(viewButton);
      expect(onView).toHaveBeenCalledWith(produtosMock[0]);
    });
    it("should filter to status", () => {
      type Status = "ativo" | "inativo";
      type FilterStatus = Status | "todos";

      interface Produto {
        id: number;
        nome: string;
        status: Status;
      }
      const mockProdutos: Produto[] = [
        { id: 1, nome: "Produto A", status: "ativo" },
        { id: 2, nome: "Produto B", status: "inativo" },
        { id: 3, nome: "Item C", status: "ativo" },
      ];
      const filterStatus: FilterStatus = "ativo";

      const searchTerm = " ";
      const result = mockProdutos.filter((produto) => {
        if (produto.status !== filterStatus) {
          return false;
        }
        if (
          searchTerm &&
          !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe("ativo");
      expect(result[1].status).toBe("ativo");
    });
    it("should filter to status and search term", () => {
      type Status = "ativo" | "inativo";
      type FilterStatus = Status | "todos";

      interface Produto {
        id: number;
        nome: string;
        status: Status;
      }
      const mockProdutos: Produto[] = [
        { id: 1, nome: "Produto A", status: "ativo" },
        { id: 2, nome: "Produto B", status: "inativo" },
        { id: 3, nome: "Item C", status: "ativo" },
      ];
      const filterStatus: FilterStatus = "ativo";

      const searchTerm = "Produto A";
      const result = mockProdutos.filter((produto) => {
        if (produto.status !== filterStatus) {
          return false;
        }
        if (
          searchTerm &&
          !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      expect(result).toHaveLength(1);
    });
    it("should return empty array", () => {
      type Status = "ativo" | "inativo";

      interface Produto {
        id: number;
        nome: string;
        status: Status;
      }
      const mockProdutos: Produto[] = [
        { id: 1, nome: "Produto A", status: "ativo" },
        { id: 3, nome: "Item C", status: "ativo" },
      ];
      const filterStatus = "inativo";

      const searchTerm = " ";
      const result = mockProdutos.filter((produto) => {
        if (produto.status !== (filterStatus as Status)) {
          return false;
        }
        if (
          searchTerm &&
          !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      expect(result).toHaveLength(0);
    });
  });
  it("should filter by name", async () => {
    const mockProdutos: IProduto[] = [
      {
        id: 1,
        nome: "Produto A",
        status: "ativo",
        categoria: "Categoria A",
        estoque: 100,
        minimo: 10,
        preco: 100,
        ultimaMovimentacao: "2023-01-01",
      },
      {
        id: 2,
        nome: "Produto B",
        status: "inativo",
        categoria: "Categoria B",
        estoque: 200,
        minimo: 20,
        preco: 200,
        ultimaMovimentacao: "2023-02-02",
      },
    ];

    render(
      <TabelaProdutos
        produtos={mockProdutos}
        onView={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    const searchInput = screen.getByRole("textbox");
    await userEvent.type(searchInput, "Produto A");

    expect(screen.getByText("Produto A")).toBeInTheDocument();
    expect(screen.queryByText("Produto B")).not.toBeInTheDocument();
  });
  describe("TabelaProdutos", () => {
    const mockProdutos: IProduto[] = [
      {
        id: 1,
        nome: "Água Mineral 500ml",
        categoria: "Água",
        estoque: 100,
        minimo: 10,
        preco: 200,
        status: "ativo",
        ultimaMovimentacao: new Date().toISOString(),
      },
      {
        id: 2,
        nome: "Água Mineral 1L",
        categoria: "Água",
        estoque: 50,
        minimo: 5,
        preco: 300,
        status: "inativo",
        ultimaMovimentacao: new Date().toISOString(),
      },
    ];

    const mockHandlers = {
      onView: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    };

    it("Filtro por Status", async () => {
      if (!Element.prototype.hasPointerCapture) {
        Element.prototype.hasPointerCapture = () => false;
      }
      window.HTMLElement.prototype.scrollIntoView = vi.fn();

      render(<TabelaProdutos produtos={mockProdutos} {...mockHandlers} />);

      const selectTrigger = screen.getByRole("combobox");
      await userEvent.click(selectTrigger);

      const option = await screen.findByText("Em estoque");
      expect(option).toBeInTheDocument();
      await userEvent.click(option);
    });
  });
});
