using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class Wallet
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public ApplicationUser User { get; set; }
    public List<Operation>? Operations { get; set; }
    public DateTime ReferenceDate { get; set; }
    public decimal AmountInvested { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdraw { get; set; }
    public decimal Profit { get; set; }
    public decimal CurrentHeritage { get; set; }
}