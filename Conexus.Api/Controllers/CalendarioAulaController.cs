// 

using Conexus.Api.Infra;
using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Aplication.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;

namespace Conexus.Api.Controllers;

public class CalendarioAulaController : ApiControllerBase
{
    private readonly ICalendarioAulaServiceDomain _CalendarioAulaService;
    // Adicionamos o contexto para buscas rápidas ou se o service exigir
    private readonly AppDbContext _context;

    public CalendarioAulaController(ICalendarioAulaServiceDomain service, AppDbContext context)
    {
        _CalendarioAulaService = service;
        _context = context;
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> Inserir([FromBody] CalendarioAulaDTO CalendarioAula)
    {
        // O service processa o DTO que contém DateOnly/TimeOnly
        ApplicationResult<long> result = await _CalendarioAulaService.Inserir(CalendarioAula);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("buscartodos")]
    public async Task<IActionResult> BuscarTodos()
    {
        // Certifique-se que o Service retorna um ApplicationResult contendo a lista de DTOs
        var result = await _CalendarioAulaService.BuscarTodos();
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("atualizar")]
    public async Task<IActionResult> Atualizar([FromBody] CalendarioAulaDTO CalendarioAula)
    {
        var result = await _CalendarioAulaService.Atualizar(CalendarioAula);
        return StatusCode(result.StatusCode, result);
    }
    
    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var result = await _CalendarioAulaService.Excluir(id);
        return StatusCode(result.StatusCode, result);
    }
}