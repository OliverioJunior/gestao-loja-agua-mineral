import { HeaderDesktop } from "@/shared/components/layout/Header/header-desktop";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, it, expect, vi } from "vitest";

describe("HeaderDesktop", () => {
  describe("Renderização", () => {
    it("renderiza corretamente todos os elementos", () => {
      render(<HeaderDesktop onNotificationClick={vi.fn()} />);
      const button = screen.getByRole("button", {
        name: /abrir notificações/i,
      });
      expect(button).toBeInTheDocument();
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();

      const perfil = screen.getByLabelText("Perfil");
      expect(perfil).toBeInTheDocument();
    });

    it("aplicar as classes CSS corretas", () => {
      const { container } = render(<HeaderDesktop />);

      const headerElement = container.firstChild as HTMLElement;
      expect(headerElement).toHaveClass(
        "hidden",
        "lg:flex",
        "bg-[var(--card)]",
        "border-b",
        "border-[var(--border)]",
        "px-6 py-4 ",
        "items-center justify-between"
      );
    });

    it("renderiza o ícone de notificação", () => {
      render(<HeaderDesktop />);

      const bellIcon = screen
        .getByLabelText("Abrir notificações")
        .querySelector("svg");
      expect(bellIcon).toBeInTheDocument();
    });

    it("renderiza o avatar com as iniciais JS", () => {
      render(<HeaderDesktop />);

      const avatar = screen.getByLabelText("Perfil");
      expect(avatar).toBeInTheDocument();
      expect(screen.getByText("JS")).toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("chamar onNotificationClick quando o botão for clicado", async () => {
      const user = userEvent.setup();
      const mockOnNotificationClick = vi.fn();

      render(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const notificationButton = screen.getByLabelText("Abrir notificações");
      await user.click(notificationButton);

      expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
    });

    it("desabilita o botão quando onNotificationClick não for fornecido", () => {
      render(<HeaderDesktop />);

      const notificationButton = screen.getByLabelText("Abrir notificações");
      expect(notificationButton).toBeDisabled();
    });

    it("habilita o botão quando onNotificationClick for fornecido", () => {
      const mockOnNotificationClick = vi.fn();

      render(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const notificationButton = screen.getByLabelText("Abrir notificações");
      expect(notificationButton).not.toBeDisabled();
    });

    it("funciona com clique via fireEvent", () => {
      const mockOnNotificationClick = vi.fn();

      render(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const notificationButton = screen.getByLabelText("Abrir notificações");
      fireEvent.click(notificationButton);

      expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Acessibilidade", () => {
    it("tem aria-label correto no botão de notificação", () => {
      render(<HeaderDesktop />);

      expect(screen.getByLabelText("Abrir notificações")).toBeInTheDocument();
    });

    it("tem aria-label correto no avatar", () => {
      render(<HeaderDesktop />);

      expect(screen.getByLabelText("Perfil")).toBeInTheDocument();
    });

    it("navegável por teclado", async () => {
      const user = userEvent.setup();
      const mockOnNotificationClick = vi.fn();

      render(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const notificationButton = screen.getByLabelText("Abrir notificações");

      // Foco no botão
      await user.tab();
      expect(notificationButton).toHaveFocus();

      // Ativação via Enter
      await user.keyboard("{Enter}");
      expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Memorização e Performance", () => {
    it("componente memorizado", () => {
      const mockOnNotificationClick = vi.fn();

      const { rerender } = render(
        <HeaderDesktop onNotificationClick={mockOnNotificationClick} />
      );

      // Rerenderizar com as mesmas props
      rerender(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      // O componente deve continuar funcionando normalmente
      expect(screen.getByLabelText("Abrir notificações")).toBeInTheDocument();
    });

    it("preserva a referência da função callback", () => {
      const mockOnNotificationClick = vi.fn();

      const { rerender } = render(
        <HeaderDesktop onNotificationClick={mockOnNotificationClick} />
      );

      // Rerenderizar com a mesma função
      rerender(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const buttonAfter = screen.getByLabelText("Abrir notificações");

      // Verificar se a função ainda funciona
      fireEvent.click(buttonAfter);
      expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("funciona quando onNotificationClick é undefined", () => {
      expect(() => {
        render(<HeaderDesktop onNotificationClick={undefined} />);
      }).not.toThrow();
    });

    it("não quebra quando chamado múltiplas vezes", async () => {
      const user = userEvent.setup();
      const mockOnNotificationClick = vi.fn();

      render(<HeaderDesktop onNotificationClick={mockOnNotificationClick} />);

      const notificationButton = screen.getByLabelText("Abrir notificações");

      await user.click(notificationButton);
      await user.click(notificationButton);
      await user.click(notificationButton);

      expect(mockOnNotificationClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Snapshots", () => {
    it("corresponde ao snapshot com props padrão", () => {
      const { container } = render(<HeaderDesktop />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("corresponde ao snapshot com onNotificationClick", () => {
      const mockOnNotificationClick = vi.fn();
      const { container } = render(
        <HeaderDesktop onNotificationClick={mockOnNotificationClick} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
