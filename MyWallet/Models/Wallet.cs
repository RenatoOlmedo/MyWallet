using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class Wallet
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public ApplicationUser User { get; set; }
    public List<Operation>? Operations { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public List<Deposit>? Deposit { get; set; }
    public List<Withdraw>? Withdraw { get; set; }
}