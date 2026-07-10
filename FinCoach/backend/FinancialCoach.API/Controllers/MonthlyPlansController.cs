using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/monthly-plans")]
public sealed class MonthlyPlansController(IMonthlyPlanningService monthlyPlanningService) : ControllerBase
{
    [HttpGet("current/{userProfileId:guid}")]
    public async Task<ActionResult<MonthlyPlanResponse>> GetCurrent(Guid userProfileId, CancellationToken cancellationToken)
    {
        var plan = await monthlyPlanningService.GetCurrentAsync(userProfileId, cancellationToken);
        return plan is null ? NotFound() : Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<MonthlyPlanResponse>> Upsert(MonthlyPlanRequest request, CancellationToken cancellationToken)
    {
        var response = await monthlyPlanningService.UpsertAsync(request, cancellationToken);
        return Ok(response);
    }
}