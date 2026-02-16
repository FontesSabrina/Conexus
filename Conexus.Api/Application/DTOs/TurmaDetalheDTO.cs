// 

namespace Conexus.Api.Aplication.DTOs;

public partial class TurmaDetalheDTO
{
    public int Idturma { get; set; } 
    public string? DiasSemana { get; set; }
    
    public string? HoraInicio { get; set; } 
    
    public string? Sala { get; set; }
    public string IdiomaDescricao { get; set; } = string.Empty;
    public string NivelDescricao { get; set; } = string.Empty;
    public string NomeFuncionario { get; set; } = string.Empty;
}