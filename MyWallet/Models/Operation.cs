using System.ComponentModel.DataAnnotations;
using MyWallet.Models.Enums;

namespace MyWallet.Models;

public class Operation
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public ApplicationUser User { get; set; }
    public decimal Result { get; set; }
    public string FinancialOperation { get; set; }
    public OperationStatusEnum Status { get; set; }
}