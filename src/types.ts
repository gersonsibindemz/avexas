export interface Componente {
  id: string;
  nome: string;
  codigo: string;
  localizacao: string;
  status: string;
  categoria: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  anoFabricacao: string;
  dataAquisicao: string;
  prazoGarantia: string;
  image_url?: string | null;
  document_urls?: string[] | null;
  equipamento_id: string;
}

export interface Equipamento {
  id: string;
  nome: string;
  codigo: string;
  localizacao: string;
  status: string;
  categoria: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  anoFabricacao: string;
  dataAquisicao: string;
  prazoGarantia: string;
  grupoSubgrupo?: string | null;
  criticidade?: string | null;
  image_url?: string | null;
  document_urls?: string[] | null;
  componentes: Componente[];
}

export interface AdvancedFilters {
  sort: 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';
  locations: string[];
  status: string[];
}
