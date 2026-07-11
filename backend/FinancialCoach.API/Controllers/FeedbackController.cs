using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/feedback")]
public sealed class FeedbackController(IFeedbackService feedbackService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<FeedbackEntryResponse>>> GetRecent(CancellationToken cancellationToken) =>
        Ok(await feedbackService.GetRecentAsync(cancellationToken));

    [HttpPost]
    public async Task<ActionResult<FeedbackEntryResponse>> Create(FeedbackEntryRequest request, CancellationToken cancellationToken)
    {
        var response = await feedbackService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetRecent), new { id = response.Id }, response);
    }
}