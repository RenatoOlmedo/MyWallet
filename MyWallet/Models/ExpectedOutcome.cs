using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class ExpectedOutcome
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public decimal ExpectedResult { get; set; }
    public string FinancialOperation { get; set; }
}