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

    [HttpGet("{userProfileId:guid}/{year:int}/{month:int}")]
    public async Task<ActionResult<DashboardSummaryResponse>> GetByMonth(Guid userProfileId, int year, int month, CancellationToken cancellationToken)
    {
        if (month is < 1 or > 12)
        {
            return BadRequest("Month must be between 1 and 12.");
        }

        return Ok(await dashboardService.GetSummaryAsync(userProfileId, new DateTime(year, month, 1), cancellationToken));
    }
}