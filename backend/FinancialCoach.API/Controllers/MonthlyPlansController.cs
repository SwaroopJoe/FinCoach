using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/monthly-plans")]
public sealed class MonthlyPlansController(IMonthlyPlanningService monthlyPlanningService) : ControllerBase
{
    [HttpGet("current/{userProfileId:guid}")]
    public async Task<ActionResult<MonthlyPlanResponse?>> GetCurrent(Guid userProfileId, CancellationToken cancellationToken)
    {
        var plan = await monthlyPlanningService.GetCurrentAsync(userProfileId, cancellationToken);
        return Ok(plan);
    }

    [HttpGet("{userProfileId:guid}/{year:int}/{month:int}")]
    public async Task<ActionResult<MonthlyPlanResponse?>> GetByMonth(Guid userProfileId, int year, int month, CancellationToken cancellationToken)
    {
        if (month is < 1 or > 12)
        {
            return BadRequest("Month must be between 1 and 12.");
        }

        var plan = await monthlyPlanningService.GetByMonthAsync(userProfileId, new DateTime(year, month, 1), cancellationToken);
        return Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<MonthlyPlanResponse>> Upsert(MonthlyPlanRequest request, CancellationToken cancellationToken)
    {
        var response = await monthlyPlanningService.UpsertAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpDelete("current/{userProfileId:guid}")]
    public async Task<IActionResult> ResetCurrent(Guid userProfileId, CancellationToken cancellationToken)
    {
        var deleted = await monthlyPlanningService.ResetCurrentAsync(userProfileId, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpDelete("{userProfileId:guid}/{year:int}/{month:int}")]
    public async Task<IActionResult> ResetByMonth(Guid userProfileId, int year, int month, CancellationToken cancellationToken)
    {
        if (month is < 1 or > 12)
        {
            return BadRequest("Month must be between 1 and 12.");
        }

        var deleted = await monthlyPlanningService.ResetByMonthAsync(userProfileId, new DateTime(year, month, 1), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}