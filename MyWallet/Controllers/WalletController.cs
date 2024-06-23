using Microsoft.AspNetCore.Mvc;
using MyWallet.Interfaces;
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
    [Route("GetFixedInfos")]
    public async Task<IActionResult> GetFixedInfosByUser([FromQuery] string id)
    {
        try
        {
            var result = await _walletService.GetFixedInfosByUser(id);

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
    public async Task<IActionResult> UpdateWalletByUser([FromBody] WalletDTO wallet)
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
            return BadRequest(e);
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
            return BadRequest(e);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteWallet([FromQuery] string walletId)
    {
        try
        {
            await _walletService.DeleteWalletAsync(walletId);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpGet]
    [Route("GetPeriodResult")]
    public async Task<IActionResult> GetPeriodResult([FromQuery] string userId)
    {
        try
        {
            var periodResults = await _walletService.GetPeriodResultByUserAsync(userId);

            return Ok(new {periodResults});
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpGet]
    [Route("GetHeritage")]
    public async Task<IActionResult> GetInvestments([FromQuery] string userId)
    {
        try
        {
            var investments = await _walletService.GetHeritageByUserAsync(userId);

            return Ok(investments);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost]
    [Route("CreateHeritage")]
    public async Task<IActionResult> CreateInvestments([FromQuery] string userId, [FromBody] HeritageDTO heritage)
    {
        try
        {
            await _walletService.CreateHeritageByUserAsync(userId, heritage);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
}