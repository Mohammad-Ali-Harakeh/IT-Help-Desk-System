
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Dashboard/statistics
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalTickets = await _context.Tickets.CountAsync();

            var openTickets = await _context.Tickets
                .CountAsync(t => t.StatusId == 1);

            var inProgressTickets = await _context.Tickets
                .CountAsync(t => t.StatusId == 2);

            var resolvedTickets = await _context.Tickets
                .CountAsync(t => t.StatusId == 3);

            var closedTickets = await _context.Tickets
                .CountAsync(t => t.StatusId == 4);


            var ticketsByStatus = await _context.Tickets
                .GroupBy(t => t.StatusId)
                .Select(g => new
                {
                    statusId = g.Key,
                    count = g.Count()
                })
                .ToListAsync();


            var ticketsByPriority = await _context.Tickets
                .GroupBy(t => t.PriorityId)
                .Select(g => new
                {
                    priorityId = g.Key,
                    count = g.Count()
                })
                .ToListAsync();


            var ticketsByCategory = await _context.Tickets
                .GroupBy(t => t.CategoryId)
                .Select(g => new
                {
                    categoryId = g.Key,
                    count = g.Count()
                })
                .ToListAsync();


            return Ok(new
            {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
                closedTickets,
                ticketsByStatus,
                ticketsByPriority,
                ticketsByCategory
            });
        }
    }
}
