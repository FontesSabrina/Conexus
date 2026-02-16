namespace Conexus.Api.Aplication.DTOs;

public partial class MaterialDetalheDTO
{
    // ESSENCIAL: O ID deve estar presente para as ações (editar/excluir) funcionarem
    public int Idmaterial { get; set; } 

    public string Titulo { get; set; } = null!;

    // Campos de descrição (Joins)
    public string TipoMaterialDescricao { get; set; } = string.Empty;

    public string IdiomaDescricao { get; set; } = string.Empty;
    
    public string NivelDescricao { get; set; } = string.Empty;

    // Se quiser exibir o link na tabela, descomente este também:
    public string? Link { get; set; } 
}