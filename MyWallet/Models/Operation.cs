using System.ComponentModel.DataAnnotations;
using MyWallet.Models.Enums;

namespace MyWallet.Models;

public class Operation
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public decimal Result { get; set; }
    public string FinancialOperation { get; set; }
    public decimal ExpectedOutcome { get; set; }
    public OperationStatusEnum Status { get; set; }
}