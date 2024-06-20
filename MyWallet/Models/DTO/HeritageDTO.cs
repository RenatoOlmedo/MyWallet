namespace MyWallet.Models.DTO;

public class HeritageDTO
{
    public string HeritageId { get; set; }
    public decimal Balance { get; set; }
    public List<InvestmentDTO> Investments { get; set; }
}