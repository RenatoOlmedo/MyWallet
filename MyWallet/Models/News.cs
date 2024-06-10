using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class News
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int Year { get; set; }
    public int Month { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
}