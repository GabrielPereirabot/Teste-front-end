export interface User {
  id?: string;                  // pode vir como string (UUID ou similar)
  name: string;
  cpf: string;
  documento_identidade: string;
  sexo: string;
  data_nascimento: string;      // Date no backend → string (ISO) no JSON
  telefone: string;
  email: string;
  login: string;
  password?: string;            // opcional, geralmente omitido em respostas
  role: string;
  created_at?: string;          // Timestamp → string ISO no JSON
  updated_at?: string;
} 
