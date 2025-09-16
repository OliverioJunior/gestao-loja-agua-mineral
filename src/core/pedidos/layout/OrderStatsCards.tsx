"use client";
import { GenericStatsCard } from "@/shared/components/ui";
import { ShoppingCart, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { OrderStatsCardsProps } from "./types";
import { useEffect, useState } from "react";

export function OrderStatsCards({
  stats,
}: Omit<
  OrderStatsCardsProps,
  | "pendentesPercentage"
  | "confirmadosPercentage"
  | "entreguesPercentage"
  | "canceladosPercentage"
>) {
  const [version, setVersion] = useState(() =>
    typeof window !== "undefined" && window.innerWidth > 768
      ? "desktop"
      : "mobile"
  );
  const [width, setWidth] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setVersion(window?.innerWidth > 768 ? "desktop" : "mobile");
      setWidth((window?.innerWidth).toString());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const pendentesPercentage =
    stats.total > 0 ? (stats.pendentes / stats.total) * 100 : 0;
  const confirmadosPercentage =
    stats.total > 0 ? (stats.confirmados / stats.total) * 100 : 0;
  const entreguesPercentage =
    stats.total > 0 ? (stats.entregues / stats.total) * 100 : 0;
  const canceladosPercentage =
    stats.total > 0 ? (stats.cancelados / stats.total) * 100 : 0;

  return version === "desktop"
    ? desktop({
        stats,
        pendentesPercentage,
        confirmadosPercentage,
        entreguesPercentage,
        canceladosPercentage,
      })
    : mobile(
        {
          stats,
          pendentesPercentage,
          confirmadosPercentage,
          entreguesPercentage,
          canceladosPercentage,
        },
        width || ""
      );
}

const desktop = ({
  stats,
  pendentesPercentage,
  confirmadosPercentage,
  entreguesPercentage,
  canceladosPercentage,
}: OrderStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <GenericStatsCard
        title="Total de Pedidos"
        value={stats.total}
        icon={ShoppingCart}
        variant="info"
        size="sm"
        description="Todos os pedidos cadastrados"
        showBorder
        borderPosition="left"
        loading={!stats.total}
      />

      <GenericStatsCard
        title="Pendentes"
        value={stats.pendentes}
        icon={Clock}
        variant="warning"
        size="sm"
        description={`${pendentesPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        loading={!stats.pendentes}
      />

      <GenericStatsCard
        title="Confirmados"
        value={stats.confirmados}
        icon={CheckCircle}
        variant="info"
        size="sm"
        description={`${confirmadosPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        loading={!stats.confirmados}
      />

      <GenericStatsCard
        title="Entregues"
        value={stats.entregues}
        icon={Truck}
        variant="success"
        size="sm"
        description={`${entreguesPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        loading={!stats.entregues}
      />

      <GenericStatsCard
        title="Cancelados"
        value={stats.cancelados}
        icon={XCircle}
        variant="danger"
        size="sm"
        description={`${canceladosPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        loading={!stats.entregues}
      />
    </div>
  );
};
const mobile = (
  {
    stats,
    canceladosPercentage,
    confirmadosPercentage,
    entreguesPercentage,
    pendentesPercentage,
  }: OrderStatsCardsProps,
  width: string
) => {
  if (!width) return null;

  const carsdArray = [
    <GenericStatsCard
      className="flex-1 min-w-9/12"
      title="Total de Pedidos"
      key={"stats.total"}
      value={stats.total}
      icon={ShoppingCart}
      variant="info"
      size="sm"
      description="Todos os pedidos cadastrados"
      showBorder
      borderPosition="left"
      loading={!stats.total}
    />,
    <GenericStatsCard
      className="flex-2 min-w-9/12"
      key={"stats.pendentes"}
      title="Pendentes"
      value={stats.pendentes}
      icon={Clock}
      variant="warning"
      size="sm"
      description={`${pendentesPercentage.toFixed(1)}% do total`}
      showBorder
      borderPosition="left"
      loading={!stats.pendentes}
    />,
    <GenericStatsCard
      className="flex-3 min-w-9/12"
      key={"stats.confirmados"}
      title="Confirmados"
      value={stats.confirmados}
      icon={CheckCircle}
      variant="info"
      size="sm"
      description={`${confirmadosPercentage.toFixed(1)}% do total`}
      showBorder
      borderPosition="left"
      loading={!stats.confirmados}
    />,
    <GenericStatsCard
      className="flex-4 min-w-9/12"
      key={"stats.entregues"}
      title="Entregues"
      value={stats.entregues}
      icon={Truck}
      variant="success"
      size="sm"
      description={`${entreguesPercentage.toFixed(1)}% do total`}
      showBorder
      borderPosition="left"
      loading={!stats.entregues}
    />,
    <GenericStatsCard
      className="flex-5 min-w-9/12"
      key={"stats.cancelados"}
      title="Cancelados"
      value={stats.cancelados}
      icon={XCircle}
      variant="danger"
      size="sm"
      description={`${canceladosPercentage.toFixed(1)}% do total`}
      showBorder
      borderPosition="left"
      loading={!stats.entregues}
    />,
  ];

  return (
    <div
      className={`flex gap-4 overflow-auto `}
      style={{
        maxWidth: `${Number(width) - 48}px`,
      }}
    >
      {carsdArray}
    </div>
  );
};
