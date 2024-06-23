using System.ComponentModel;

namespace MyWallet.Models.Enums;

public enum MonthsEnum
{
    [Description("Janeiro")]
    Jan = 1,
    
    [Description("Fevereiro")]
    Fev = 2,
    
    [Description("Março")]
    Mar = 3,
    
    [Description("Abril")]
    Abr = 4,
    
    [Description("Maio")]
    Mai = 5,
    
    [Description("Junho")]
    Jun = 6,
    
    [Description("Julho")]
    Jul = 7,
    
    [Description("Agosto")]
    Ago = 8,
    
    [Description("Setembro")]
    Set = 9,
    
    [Description("Outubro")]
    Out = 10,
    
    [Description("Novembro")]
    Nov = 11,
    
    [Description("Dezembro")]
    Dez = 12
}