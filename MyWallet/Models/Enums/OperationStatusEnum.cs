using System.ComponentModel;

namespace MyWallet.Models.Enums;

public enum OperationStatusEnum
{
    [Description("Finalizada")]
    Completed = 1,
    
    [Description("Em Andamento")]
    Ongoing = 2,
}