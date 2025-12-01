// Estrutura que corresponde ao VisitanteRequestDTO.java
export interface VisitanteRequest {
    nomeCompleto: string;
    cpf: string;
    telefone: string;
    sexo: string;
    documentoIdentidade: string | null;
    dataNascimento: string | null; // Usamos string para representar LocalDate ou Date
    foto: string | null;
}

// Estrutura que você espera receber após um registro (VisitanteResponseDTO.java)
export interface VisitanteResponse {
    id: number;
    nomeCompleto: string;
    cpf: string;
    telefone: string;
    // ... outros campos de retorno, como status, horaChegada, etc.
    status: 'ATIVO' | 'INATIVO';
    horaChegada: string;
}