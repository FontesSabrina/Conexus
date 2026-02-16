// using Conexus.Api.Infra;
// using Conexus.Api.Domain.Services.Interfaces;
// using Conexus.Api.Aplication.DTOs;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Conexus.Api.Aplication;

// namespace Conexus.Api.Controllers;

// public class MaterialController : ApiControllerBase
// {

//     private readonly IMaterialServiceDomain _MaterialService;
//     public MaterialController(IMaterialServiceDomain service) //injeção de dependencia
//     {
//         _MaterialService = service;
//     }

//     [HttpPost("inserir")]
//     public async Task<IActionResult> Inserir([FromBody] MaterialDTO Material)
//     {
//         ApplicationResult<long> result = await _MaterialService.Inserir(Material);
//         return StatusCode(result.StatusCode, result);
//     }
//     public async Task<ApplicationResult<List<MaterialDetalheDTO>>> BuscarTodos()
//     {
//         var materiais = await _context.Materiais
//             .Select(m => new MaterialDetalheDTO
//             {
//                 Idmaterial = m.Idmaterial,
//                 Titulo = m.Titulo,
//                 FormatoArquivo = m.FormatoArquivo,
//                 Link = m.Link, // Certifique-se que o campo existe na model

//                 // Fazendo o "Join" para pegar as descrições
//                 TipoMaterialDescricao = m.IdtipoMaterialNavigation != null 
//                     ? m.IdtipoMaterialNavigation.Descricao : "N/A",

//                 IdiomaDescricao = m.IdidiomaNavigation != null 
//                     ? m.IdidiomaNavigation.Descricao : "N/A",

//                 NivelDescricao = m.IdnivelNavigation != null 
//                     ? m.IdnivelNavigation.Descricao : "N/A"
//             })
//             .ToListAsync();

//         return ApplicationResult<List<MaterialDetalheDTO>>.Success(materiais, 200, "Registros Localizados.");
//     }
    
//     [HttpPut("atualizar")]
//     public async Task<IActionResult> Atualizar(MaterialDTO Material)
//     {
//        var result = await _MaterialService.Atualizar(Material);
//         return StatusCode(result.StatusCode, result);
//     }
    
//     [HttpDelete("excluir/{id}")]
//     public async Task<IActionResult> Excluir(int id)
//     {
//         var result = await _MaterialService.Excluir(id);
//         return StatusCode(result.StatusCode, result);
//     }
    
// }

using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Aplication.DTOs;
using Microsoft.AspNetCore.Mvc;
using Conexus.Api.Aplication;

namespace Conexus.Api.Controllers;

public class MaterialController : ApiControllerBase
{
    private readonly IMaterialServiceDomain _MaterialService;

    public MaterialController(IMaterialServiceDomain service)
    {
        _MaterialService = service;
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> Inserir([FromBody] MaterialDTO material)
    {
        var result = await _MaterialService.Inserir(material);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("buscartodos")]
    public async Task<IActionResult> BuscarTodos()
    {
        // CORREÇÃO: Chamamos o Service. Ele é quem tem o "_context".
        var result = await _MaterialService.BuscarTodos();
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("atualizar")]
    public async Task<IActionResult> Atualizar([FromBody] MaterialDTO material)
    {
        var result = await _MaterialService.Atualizar(material);
        return StatusCode(result.StatusCode, result);
    }
    
    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var result = await _MaterialService.Excluir(id);
        return StatusCode(result.StatusCode, result);
    }
}