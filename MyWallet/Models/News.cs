using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class News
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; }
    public string Body { get; set; }
}