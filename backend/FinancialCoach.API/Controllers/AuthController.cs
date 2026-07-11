using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthPlaceholderService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthLoginResponse>> Register(AuthUsernameRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(new { message = "Username is required." });
        }

        var response = await authService.RegisterAsync(request, cancellationToken);
        return response is null ? Conflict(new { message = "Username already exists. Sign in instead." }) : Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthLoginResponse>> Login(AuthUsernameRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(new { message = "Username is required." });
        }

        var response = await authService.LoginAsync(request, cancellationToken);
        return response is null ? Unauthorized(new { message = "Username not found. Create it first." }) : Ok(response);
    }
}