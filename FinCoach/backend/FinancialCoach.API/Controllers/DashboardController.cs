using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("{userProfileId:guid}")]
    public async Task<ActionResult<DashboardSummaryResponse>> Get(Guid userProfileId, CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetSummaryAsync(userProfileId, cancellationToken));
    }
}