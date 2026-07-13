using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/ai-coach")]
public sealed class AiCoachController(IAiCoachService aiCoachService) : ControllerBase
{
    [HttpPost("monthly")]
    public async Task<ActionResult<AiCoachResponse>> GetMonthlyCoach(AiCoachRequest request, CancellationToken cancellationToken)
    {
        if (request.Month is < 1 or > 12)
        {
            return BadRequest("Month must be between 1 and 12.");
        }

        if (request.Year.HasValue != request.Month.HasValue)
        {
            return BadRequest("Year and month must be supplied together.");
        }

        try
        {
            var response = await aiCoachService.GetMonthlyCoachAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (InvalidOperationException exception)
        {
            return NotFound(exception.Message);
        }
    }
}
