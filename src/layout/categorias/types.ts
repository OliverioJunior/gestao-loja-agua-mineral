export interface ICategory {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryRow {
  category: ICategory;
  onView: (category: ICategory) => void;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export interface IFiltrosCategorias {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
}

export interface ICategoryStats {
  total: number;
  withProducts: number;
}
