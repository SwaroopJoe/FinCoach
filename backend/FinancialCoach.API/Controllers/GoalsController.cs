using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/goals")]
public sealed class GoalsController(IGoalService goalService) : ControllerBase
{
    [HttpGet("{userProfileId:guid}")]
    public async Task<ActionResult<IReadOnlyCollection<FinancialGoalResponse>>> Get(Guid userProfileId, CancellationToken cancellationToken) =>
        Ok(await goalService.GetAllAsync(userProfileId, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<FinancialGoalResponse>> Create(FinancialGoalRequest request, CancellationToken cancellationToken)
    {
        var response = await goalService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { userProfileId = response.UserProfileId }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FinancialGoalResponse>> Update(Guid id, FinancialGoalRequest request, CancellationToken cancellationToken)
    {
        var response = await goalService.UpdateAsync(id, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await goalService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id:guid}/contributions")]
    public async Task<ActionResult<GoalContributionResponse>> AddContribution(Guid id, GoalContributionRequest request, CancellationToken cancellationToken)
    {
        var response = await goalService.AddContributionAsync(id, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }
}