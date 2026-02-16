

// public class UsuarioController : ApiControllerBase
// {

//     private readonly IUsuarioServiceDomain _UsuarioService;
//     public UsuarioController(IUsuarioServiceDomain service) //injeção de dependencia
//     {
//         _UsuarioService = service;
//     }

//     [HttpPost("inserir")]
//     public async Task<IActionResult> Inserir([FromBody] UsuarioDTO Usuario)
//     {
//         ApplicationResult<long> result = await _UsuarioService.Inserir(Usuario);
//         return StatusCode(result.StatusCode, result);
//     }


//     [HttpGet("buscartodos")] //sempre especificar os verbos (o que eu quero que aconteça)
//     public async Task<IActionResult> BuscarTodos()
//     {
//         var result = await _UsuarioService.BuscarTodos();
//         return StatusCode(result.StatusCode, result); //retorna o status code 200
//     }

//     [HttpPut("atualizar")]
//     public async Task<IActionResult> Atualizar(UsuarioDTO Usuario)
//     {
//        var result = await _UsuarioService.Atualizar(Usuario);
//         return StatusCode(result.StatusCode, result);
//     }
    
//     [HttpDelete("excluir/{id}")]
//     public async Task<IActionResult> Excluir(int id)
//     {
//         var result = await _UsuarioService.Excluir(id);
//         return StatusCode(result.StatusCode, result);
//     }

//     [HttpPost("login")]
//     public async Task<ActionResult> Login([FromBody] LoginRequest loginDto)
//     {
//         // 1. Limpeza do CPF: Remove pontos e traços caso o usuário tenha digitado com máscara
//         // Isso garante que "123.456.789-01" vire "12345678901" para buscar no banco corretamente.
//         if (!string.IsNullOrEmpty(loginDto.Cpf))
//         {
//             loginDto.Cpf = System.Text.RegularExpressions.Regex.Replace(loginDto.Cpf, @"[^\d]", "");
//         }

//         // 2. Busca o usuário por CPF e Senha
//         var usuario = await _context.Usuarios
//             .FirstOrDefaultAsync(u => u.Cpf == loginDto.Cpf && u.Senha == loginDto.Senha);

//         // 3. Validação de existência
//         if (usuario == null)
//         {
//             return Unauthorized(new { message = "CPF ou senha incorretos." });
//         }

//         // 4. Validação de bloqueio
//         if (usuario.Bloqueado == true)
//         {
//             return StatusCode(403, new { message = "Este usuário está bloqueado." });
//         }

//         // 5. Retorna os dados necessários para o Vue (Pinia Store) saber quem logou
//         // O campo 'papel' vai em minúsculo para facilitar o 'switch' no Frontend
//         return Ok(new
//         {
//             idusuario = usuario.Idusuario,
//             nome = usuario.Nome,
//             cpf = usuario.Cpf,
//             papel = usuario.Papel?.ToLower(), // "admin", "aluno" ou "funcionario"
//             token = "token_gerado_fake_ou_jwt" // Aqui você inserirá o JWT no futuro
//         });
//     }
    
// }

// using Conexus.Api.Infra;
// using Conexus.Api.Domain.Services.Interfaces;
// using Conexus.Api.Aplication.DTOs;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Conexus.Api.Aplication;

// namespace Conexus.Api.Controllers;

using Conexus.Api.Infra; // Certifica que está puxando a pasta onde está o AppDbContext
using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Aplication.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;

namespace Conexus.Api.Controllers;

public class UsuarioController : ApiControllerBase
{
    private readonly IUsuarioServiceDomain _UsuarioService;
    
    // AJUSTE: Alterado de ApplicationDbContext para AppDbContext
    private readonly AppDbContext _context; 

    // AJUSTE: Alterado o parâmetro no construtor para AppDbContext
    public UsuarioController(IUsuarioServiceDomain service, AppDbContext context) 
    {
        _UsuarioService = service;
        _context = context;
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> Inserir([FromBody] UsuarioDTO Usuario)
    {
        ApplicationResult<long> result = await _UsuarioService.Inserir(Usuario);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("buscartodos")]
    public async Task<IActionResult> BuscarTodos()
    {
        var result = await _UsuarioService.BuscarTodos();
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("atualizar")]
    public async Task<IActionResult> Atualizar(UsuarioDTO Usuario)
    {
       var result = await _UsuarioService.Atualizar(Usuario);
        return StatusCode(result.StatusCode, result);
    }
    
    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var result = await _UsuarioService.Excluir(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest loginDto)
    {
        if (!string.IsNullOrEmpty(loginDto.Cpf))
        {
            loginDto.Cpf = System.Text.RegularExpressions.Regex.Replace(loginDto.Cpf, @"[^\d]", "");
        }

        // Agora o _context vai funcionar apontando para AppDbContext
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Cpf == loginDto.Cpf && u.Senha == loginDto.Senha);

        if (usuario == null)
        {
            return Unauthorized(new { message = "CPF ou senha incorretos." });
        }

        if (usuario.Bloqueado == true)
        {
            return StatusCode(403, new { message = "Este usuário está bloqueado." });
        }

        return Ok(new
        {
            idusuario = usuario.Idusuario,
            nome = usuario.Nome,
            cpf = usuario.Cpf,
            papel = usuario.Papel?.ToLower(),
            token = "token_gerado_fake_ou_jwt"
        });
    }
}