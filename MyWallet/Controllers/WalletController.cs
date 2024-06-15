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
    public async Task<IActionResult> GetWalletByUser([FromQuery] string id, [FromQuery] int year, [FromQuery] int month)
    {
        try
        {
            var result = await _walletService.GetWalletByUserAndMonthAsync(id, year, month);

            return Ok(result);
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
    [Route("GetModal")]
    public async Task<IActionResult> GetWalletModalByUser([FromQuery] string id, [FromQuery] int year, [FromQuery] int month)
    {
        try
        {
            var result = await _walletService.GetWalletModalByUserAndMonthAsync(id, year, month);

            return Ok(result);
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
    
    [HttpPut]
    public async Task<IActionResult> GetWalletModalByUser([FromBody] WalletDTO wallet)
    {
        try
        {
            await _walletService.UpdateWalletAsync(wallet);

            return Ok();
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
    public async Task<IActionResult> GetWalletsByUser([FromQuery] string? userId)
    {
        try
        {
            if (userId is null)
                return NoContent();

            var walletsList = await _walletService.GetWalletListByUserAsync(userId);

            return Ok(walletsList);
        }
        catch (Exception e)
        {
            return BadRequest();
        }
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

    [HttpGet]
    [Route("GetPeriodResult")]
    public async Task<IActionResult> GetPeriodResult([FromQuery] string userId, [FromQuery] int year, [FromQuery] int month)
    {
        var periodResult = await _walletService.GetPeriodResultByUserAsync(userId, year, month);

        return Ok(periodResult);
    }

    [HttpPost]
    [Route("CreatePeriodResul")]
    public async Task<IActionResult> CreatePeriodResult([FromQuery] string userId, [FromBody] PeriodResultDTO periodResult)
    {
        try
        {
            await _walletService.CreatePeriodResultAsync(userId, periodResult);
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
}