using System;
using System.Collections.Generic;

namespace Conexus.Api.Aplication.DTOs;
public class LoginRequest {
    public string Cpf { get; set; }
    public string Senha { get; set; }
}