using MyWallet.Models.Enums;

namespace MyWallet.Models.DTO;

public class OperationDTO
{
    public decimal Result { get; set; }
    public string FinancialOperation { get; set; }
    public OperationStatusEnum Status { get; set; }
}