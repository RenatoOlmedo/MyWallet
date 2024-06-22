namespace MyWallet.Models.DTO;

public class HeritageDTO
{
    public decimal Balance { get; set; }
    public List<InvestmentDTO>? Investments { get; set; }
}