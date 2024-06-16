using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class Withdraw
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public decimal Value { get; set; }
}