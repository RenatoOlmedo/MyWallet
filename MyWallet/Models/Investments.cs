using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class Investments
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Operation { get; set; }
    public decimal Result { get; set; }
}