using Microsoft.AspNetCore.Mvc;
using MyWallet.Interfaces;
using MyWallet.Models;
using MyWallet.Models.DTO;

namespace MyWallet.Controllers;

[ApiController]
[Route("[controller]")]
public class WalletController : ControllerBase
{
    private readonly ILogger<WalletController> _logger;
    private readonly IWalletService _walletService;

    public WalletController(ILogger<WalletController> logger, IWalletService walletService)
    {
        _logger = logger;
        _walletService = walletService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWalletByUser([FromQuery] string id, [FromQuery] string date)
    {
        try
        {
            var convertedDate = Convert.ToDateTime(date);
            
            //var result = await _walletService.getWalletByUserAndMonth(id, convertedDate);

            return Ok(new{User="Renato"});
        }
        catch (KeyNotFoundException e)
        {
            Console.WriteLine(e);
            return NoContent();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e);
        }
    }

    [HttpGet]
    [Route("listWallet")]
    public IActionResult GetWalletsByUser([FromQuery] string? userId)
    {
        if (userId is null)
            return NoContent();
        
        return Ok(_walletService.GetWalletListByUser(userId));
    }

    [HttpPost]
    [Route("CreateWallet")]
    public async Task<IActionResult> CreateWallet([FromBody] WalletDTO wallet)
    {
        try
        {
            await _walletService.CreateNewWalletAsync(wallet);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
}