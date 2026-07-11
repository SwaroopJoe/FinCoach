using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IInvestmentRepository
{
    Task<IReadOnlyCollection<InvestmentHolding>> GetByUserProfileAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<InvestmentHolding?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<InvestmentHolding> AddAsync(InvestmentHolding holding, CancellationToken cancellationToken);
    Task<InvestmentHolding> UpdateAsync(InvestmentHolding holding, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(InvestmentHolding holding, CancellationToken cancellationToken);
    Task<InvestmentContribution> AddContributionAsync(InvestmentContribution contribution, CancellationToken cancellationToken);
}