using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthPlaceholderService authService) : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<AuthLoginResponse> Login(AuthLoginRequest request) => Ok(authService.Login(request));
}