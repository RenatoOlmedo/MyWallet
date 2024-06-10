using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class PeriodResult
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Result { get; set; }
    public ApplicationUser User { get; set; }
}