using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class Deposit
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public decimal Value { get; set; }
}