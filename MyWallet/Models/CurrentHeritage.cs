using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class CurrentHeritage
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public List<Investments> Investments { get; set; }
    public decimal Balance { get; set; }
    public ApplicationUser User { get; set; }
}