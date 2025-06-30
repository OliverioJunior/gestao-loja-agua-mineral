interface IResumoCard {
  titulo: string;
  valor: number | string;
  subtitulo: string;
  icone: React.ReactElement;
  cor: string;
}

export const ResumoCard: React.FC<IResumoCard> = ({
  titulo,
  valor,
  subtitulo,
  icone,
  cor,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{titulo}</p>
          <p className="text-2xl font-semibold text-white mt-1">{valor}</p>
          {subtitulo && <p className={`text-sm mt-1 ${cor}`}>{subtitulo}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            cor === "text-blue-400"
              ? "bg-blue-500/20"
              : cor === "text-green-400"
              ? "bg-green-500/20"
              : cor === "text-yellow-400"
              ? "bg-yellow-500/20"
              : "bg-red-500/20"
          }`}
        >
          {icone}
        </div>
      </div>
    </div>
  );
};
