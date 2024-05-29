namespace MyWallet.Models.DTO;

public class WalletViewDTO
{
    public string User { get; set; }
    public decimal Deposit { get; set; }
    public decimal AmountInvested { get; set; }
    public decimal CurrentHeritage { get; set; }
    public decimal Withdraw { get; set; }
    public decimal Profit { get; set; }
    public string Month { get; set; }
    public decimal Result { get; set; }
    public List<CompletedOperation> CompletedOperations { get; set; }
    public List<OnGoingOperation> OnGoingOperations { get; set; }
    public List<SimplifiedExpectedOutcome> ExpectedOutcome { get; set; }
    public List<SimplifiedNews> News { get; set; }
    public List<PeriodResult> PeriodResults { get; set; }
}

public class CompletedOperation
{
    public string FinancialOperation { get; set; }
    public decimal Result { get; set; }
}

public class SimplifiedExpectedOutcome
{
    public string FinancialOperation { get; set; }
    public decimal Result { get; set; }
}

public class SimplifiedNews
{
    public string Title { get; set; }
    public string Body { get; set; }
}

public class OnGoingOperation
{
    public string FinancialOperation { get; set; }
    public decimal Result { get; set; }
}

public class PeriodResult
{
    public string Month { get; set; }
    public decimal Result { get; set; }
}