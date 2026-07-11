using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinancialCoach.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InvestmentGoalsAndReset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FinancialGoals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserProfileId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Category = table.Column<int>(type: "INTEGER", nullable: false),
                    CustomCategory = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Priority = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetAmount = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    StartingAmount = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    TargetDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsCompleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SyncVersion = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialGoals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinancialGoals_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvestmentHoldings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserProfileId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Category = table.Column<int>(type: "INTEGER", nullable: false),
                    CustomCategory = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Quantity = table.Column<decimal>(type: "TEXT", precision: 18, scale: 4, nullable: false),
                    AverageCost = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    CurrentRate = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    ExpectedAnnualReturnPercent = table.Column<decimal>(type: "TEXT", precision: 6, scale: 2, nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SyncVersion = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestmentHoldings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestmentHoldings_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GoalContributions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    FinancialGoalId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SourceMonthlyPlanId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ContributionMonth = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SyncVersion = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoalContributions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GoalContributions_FinancialGoals_FinancialGoalId",
                        column: x => x.FinancialGoalId,
                        principalTable: "FinancialGoals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvestmentContributions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserProfileId = table.Column<Guid>(type: "TEXT", nullable: false),
                    InvestmentHoldingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SourceMonthlyPlanId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ContributionMonth = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    QuantityAdded = table.Column<decimal>(type: "TEXT", precision: 18, scale: 4, nullable: false),
                    RateAtContribution = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SyncVersion = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestmentContributions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestmentContributions_InvestmentHoldings_InvestmentHoldingId",
                        column: x => x.InvestmentHoldingId,
                        principalTable: "InvestmentHoldings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvestmentContributions_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FinancialGoals_UserProfileId",
                table: "FinancialGoals",
                column: "UserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_GoalContributions_FinancialGoalId_ContributionMonth",
                table: "GoalContributions",
                columns: new[] { "FinancialGoalId", "ContributionMonth" });

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentContributions_InvestmentHoldingId",
                table: "InvestmentContributions",
                column: "InvestmentHoldingId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentContributions_UserProfileId_ContributionMonth",
                table: "InvestmentContributions",
                columns: new[] { "UserProfileId", "ContributionMonth" });

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentHoldings_UserProfileId",
                table: "InvestmentHoldings",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GoalContributions");

            migrationBuilder.DropTable(
                name: "InvestmentContributions");

            migrationBuilder.DropTable(
                name: "FinancialGoals");

            migrationBuilder.DropTable(
                name: "InvestmentHoldings");
        }
    }
}
