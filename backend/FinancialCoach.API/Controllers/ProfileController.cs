using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinancialCoach.API.Controllers;

[ApiController]
[Route("api/profile")]
public sealed class ProfileController(IUserProfileService profileService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserProfileResponse>> Get(CancellationToken cancellationToken)
    {
        if (!TryGetAppUserId(out var appUserId))
        {
            return Unauthorized(new { message = "Sign in before loading your profile." });
        }

        var profile = await profileService.GetByAppUserIdAsync(appUserId, cancellationToken);
        return profile is null ? NoContent() : Ok(profile);
    }

    [HttpPut]
    public async Task<ActionResult<UserProfileResponse>> Upsert(UserProfileRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetAppUserId(out var appUserId))
        {
            return Unauthorized(new { message = "Sign in before saving your profile." });
        }

        return Ok(await profileService.UpsertAsync(appUserId, request, cancellationToken));
    }

    private bool TryGetAppUserId(out Guid appUserId)
    {
        var value = Request.Headers["X-FinancialCoach-UserId"].FirstOrDefault();
        return Guid.TryParse(value, out appUserId);
    }
}