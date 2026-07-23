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
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
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
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface TipoManutencao {
  id: number;
  nome: string;
}

export interface PrioridadeManutencao {
  id: number;
  nome: string;
}

export interface StatusOrdem {
  id: number;
  nome: string;
}

export interface OrdemManutencao {
  id: string;
  equipamento_id: string;
  tipo_id?: number;
  prioridade_id?: number;
  status_id?: number;
  descricao: string;
  data_execucao: string;
  tecnico_id?: string;
  tempo_gasto?: string;
  custo?: number;
  observacoes?: string;
  materiais_utilizados?: string[];
  anexo_relatorio_url?: string;
  created_at?: string;
  // Display fields from joins
  equipamento_nome?: string;
  tipo?: string;
  status?: string;
  tecnico?: string;
}

export interface PlanoManutencao {
  id: string;
  ordem_id: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: 'planejado' | 'em_execucao' | 'concluido' | 'cancelado';
  // Display fields
  ordem_descricao?: string;
  titulo?: string;
}

export interface AdvancedFilters {
  sort: 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';
  locations: string[];
  status: string[];
}

export interface Profile {
  id: string;
  name: string;
  surname: string;
  role: string;
  especialidade?: string | null;
  contacto?: string | null;
}

export interface Peca {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  fornecedor: string;
  estoque: number;
  reorder_point: number;
}

export interface OrdemPeca {
  id: string;
  ordem_id: string;
  peca_id: string;
  quantidade: number;
  // Join fields
  peca_codigo?: string;
  peca_descricao?: string;
}
