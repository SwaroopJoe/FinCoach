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
        var profile = await profileService.GetDefaultAsync(cancellationToken);
        return profile is null ? NoContent() : Ok(profile);
    }

    [HttpPut]
    public async Task<ActionResult<UserProfileResponse>> Upsert(UserProfileRequest request, CancellationToken cancellationToken)
    {
        return Ok(await profileService.UpsertAsync(request, cancellationToken));
    }
}