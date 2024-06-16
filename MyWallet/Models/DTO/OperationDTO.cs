using MyWallet.Models.Enums;

namespace MyWallet.Models.DTO;

public class OperationDTO
{
    public string? OperationId { get; set; }
    public decimal Result { get; set; }
    public string FinancialOperation { get; set; }
    public decimal ExpectedOutcome { get; set; }
    public OperationStatusEnum Status { get; set; }
}