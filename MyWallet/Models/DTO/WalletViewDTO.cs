namespace MyWallet.Models.DTO;

public class WalletViewDTO
{
    public string User { get; set; }
    public decimal Deposit { get; set; }
    public decimal AmountInvested { get; set; }
    public decimal CurrentHeritage { get; set; }
    public decimal Balance { get; set; }
    public decimal Withdraw { get; set; }
    public decimal Profit { get; set; }
    public string Month { get; set; }
    public decimal Result { get; set; }
    public List<SimplifiedOperationDTO> CompletedOperations { get; set; }
    public List<SimplifiedOperationDTO> OnGoingOperations { get; set; }
    public List<SimplifiedOperationDTO> ExpectedOutcome { get; set; }
}

public class SimplifiedOperationDTO
{
    public string FinancialOperation { get; set; }
    public decimal Result { get; set; }
}

public class PeriodResultDTO
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Result { get; set; }
}