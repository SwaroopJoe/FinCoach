using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/investments")]
public sealed class InvestmentsController(IInvestmentService investmentService) : ControllerBase
{
    [HttpGet("{userProfileId:guid}")]
    public async Task<ActionResult<InvestmentSummaryResponse>> Get(Guid userProfileId, CancellationToken cancellationToken) =>
        Ok(await investmentService.GetSummaryAsync(userProfileId, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<InvestmentHoldingResponse>> Create(InvestmentHoldingRequest request, CancellationToken cancellationToken)
    {
        var response = await investmentService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { userProfileId = response.UserProfileId }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<InvestmentHoldingResponse>> Update(Guid id, InvestmentHoldingRequest request, CancellationToken cancellationToken)
    {
        var response = await investmentService.UpdateAsync(id, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await investmentService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id:guid}/contributions")]
    public async Task<ActionResult<InvestmentContributionResponse>> AddContribution(Guid id, InvestmentContributionRequest request, CancellationToken cancellationToken)
    {
        var response = await investmentService.AddContributionAsync(id, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }
}