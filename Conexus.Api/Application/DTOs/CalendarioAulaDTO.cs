using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Conexus.Api.Aplication.DTOs;

public partial class CalendarioAulaDTO
{
    [Key]
    public int Idaula { get; set; }

    // O uso de DateOnly é excelente para o SQL Server (tipo 'date')
    public DateOnly DataAula { get; set; }

    // TimeOnly mapeia perfeitamente para o tipo 'time' no banco
    public TimeOnly HoraInicio { get; set; }

    public TimeOnly HoraFim { get; set; }

    [Required]
    public int Idfuncionario { get; set; }

    [Required]
    public int Idturma { get; set; }

    public int Idmaterial { get; set; }

    public string? Sala { get; set; }

    public string? Observacoes { get; set; }

    public string? LinkReuniao { get; set; }

    public bool? AulaExtra { get; set; }
}