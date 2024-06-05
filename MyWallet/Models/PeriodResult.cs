﻿using System.ComponentModel.DataAnnotations;

namespace MyWallet.Models;

public class PeriodResult
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public Wallet Wallet { get; set; }
    public DateTime ReferenceDate { get; set; }
    public decimal Result { get; set; }
}