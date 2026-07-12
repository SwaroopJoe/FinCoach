using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class InvestmentService(IInvestmentRepository repository) : IInvestmentService
{
    public async Task<InvestmentSummaryResponse> GetSummaryAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var holdings = await repository.GetByUserProfileAsync(userProfileId, cancellationToken);
        var responses = holdings.Select(ToResponse).ToArray();
        var totalInvested = responses.Sum(item => item.InvestedAmount);
        var totalCurrentValue = responses.Sum(item => item.CurrentValue);
        var totalGainLoss = totalCurrentValue - totalInvested;
        var totalGainLossPercent = totalInvested == 0 ? 0 : Math.Round((totalGainLoss / totalInvested) * 100, 2);

        return new InvestmentSummaryResponse(userProfileId, totalInvested, totalCurrentValue, totalGainLoss, totalGainLossPercent, responses);
    }

    public async Task<InvestmentHoldingResponse> CreateAsync(InvestmentHoldingRequest request, CancellationToken cancellationToken)
    {
        var holding = new InvestmentHolding();
        ApplyRequest(holding, request);
        var saved = await repository.AddAsync(holding, cancellationToken);
        return ToResponse(saved);
    }

    public async Task<InvestmentHoldingResponse?> UpdateAsync(Guid id, InvestmentHoldingRequest request, CancellationToken cancellationToken)
    {
        var holding = await repository.GetByIdAsync(id, cancellationToken);

        if (holding is null)
        {
            return null;
        }

        ApplyRequest(holding, request);
        var saved = await repository.UpdateAsync(holding, cancellationToken);
        return ToResponse(saved);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var holding = await repository.GetByIdAsync(id, cancellationToken);
        return holding is not null && await repository.DeleteAsync(holding, cancellationToken);
    }

    public async Task<InvestmentContributionResponse?> AddContributionAsync(Guid holdingId, InvestmentContributionRequest request, CancellationToken cancellationToken)
    {
        var holding = await repository.GetByIdAsync(holdingId, cancellationToken);

        if (holding is null || holding.UserProfileId != request.UserProfileId)
        {
            return null;
        }

        var contributionMonth = new DateTime(request.ContributionMonth.Year, request.ContributionMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var contribution = new InvestmentContribution
        {
            UserProfileId = request.UserProfileId,
            InvestmentHoldingId = holding.Id,
            ContributionMonth = contributionMonth,
            Amount = request.Amount,
            QuantityAdded = request.QuantityAdded,
            RateAtContribution = request.RateAtContribution,
            Description = request.Description.Trim()
        };

        if (request.QuantityAdded > 0)
        {
            var existingInvested = holding.Quantity * holding.AverageCost;
            var updatedQuantity = holding.Quantity + request.QuantityAdded;
            holding.AverageCost = updatedQuantity == 0 ? 0 : Math.Round((existingInvested + request.Amount) / updatedQuantity, 2);
            holding.Quantity = updatedQuantity;
        }

        if (request.RateAtContribution > 0)
        {
            holding.CurrentRate = request.RateAtContribution;
        }

        holding.MonthlyContributionAmount = request.Amount;

        holding.UpdatedAtUtc = DateTime.UtcNow;
        holding.SyncVersion++;

        var saved = await repository.AddContributionAsync(contribution, cancellationToken);
        return ToContributionResponse(saved);
    }

    private static void ApplyRequest(InvestmentHolding holding, InvestmentHoldingRequest request)
    {
        holding.UserProfileId = request.UserProfileId;
        holding.Name = request.Name.Trim();
        holding.Category = request.Category;
        holding.CustomCategory = request.CustomCategory.Trim();
        holding.Quantity = request.Quantity;
        holding.AverageCost = request.AverageCost;
        holding.CurrentRate = request.CurrentRate;
        holding.ExpectedAnnualReturnPercent = request.ExpectedAnnualReturnPercent;
        holding.TenureYears = request.TenureYears;
        holding.MonthlyContributionAmount = request.MonthlyContributionAmount;
        holding.Notes = request.Notes.Trim();
    }

    private static InvestmentHoldingResponse ToResponse(InvestmentHolding holding) => new(
        holding.Id,
        holding.UserProfileId,
        holding.Name,
        holding.Category,
        holding.CustomCategory,
        holding.Quantity,
        holding.AverageCost,
        holding.CurrentRate,
        holding.ExpectedAnnualReturnPercent,
        holding.TenureYears,
        holding.MonthlyContributionAmount,
        holding.Notes,
        holding.InvestedAmount,
        holding.CurrentValue,
        holding.GainLoss,
        holding.GainLossPercent,
        Project(holding.CurrentValue, holding.MonthlyContributionAmount, holding.ExpectedAnnualReturnPercent, 1),
        Project(holding.CurrentValue, holding.MonthlyContributionAmount, holding.ExpectedAnnualReturnPercent, 3),
        Project(holding.CurrentValue, holding.MonthlyContributionAmount, holding.ExpectedAnnualReturnPercent, 5),
        Project(holding.CurrentValue, holding.MonthlyContributionAmount, holding.ExpectedAnnualReturnPercent, holding.TenureYears),
        holding.Contributions.OrderByDescending(item => item.ContributionMonth).Select(ToContributionResponse).ToArray());

    private static InvestmentContributionResponse ToContributionResponse(InvestmentContribution contribution) => new(
        contribution.Id,
        contribution.InvestmentHoldingId,
        contribution.ContributionMonth,
        contribution.Amount,
        contribution.QuantityAdded,
        contribution.RateAtContribution,
        contribution.Description);

    private static decimal Project(decimal currentValue, decimal monthlyContributionAmount, decimal expectedAnnualReturnPercent, int years)
    {
        if (currentValue <= 0 && monthlyContributionAmount <= 0)
        {
            return currentValue;
        }

        var months = years * 12;
        var monthlyContribution = (double)monthlyContributionAmount;
        var monthlyRate = Math.Pow(1 + ((double)expectedAnnualReturnPercent / 100), 1.0 / 12.0) - 1;
        var projectedCurrentValue = (double)currentValue * Math.Pow(1 + monthlyRate, months);
        var projectedContributions = monthlyRate == 0 ? monthlyContribution * months : monthlyContribution * ((Math.Pow(1 + monthlyRate, months) - 1) / monthlyRate);
        var projected = projectedCurrentValue + projectedContributions;
        return Math.Round((decimal)projected, 2);
    }
}