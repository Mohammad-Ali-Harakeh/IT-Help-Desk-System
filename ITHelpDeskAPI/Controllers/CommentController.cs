using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.Models;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }


        // POST: api/Comment
        [HttpPost]
        public async Task<IActionResult> AddComment(TicketComment comment)
        {
            var ticket = await _context.Tickets.FindAsync(comment.TicketId);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = "Ticket not found"
                });
            }


            _context.TicketComments.Add(comment);


            _context.ActivityLogs.Add(new ActivityLog
            {
                TicketId = comment.TicketId,
                UserId = comment.UserId,
                Action = "Comment added",
                CreatedAt = DateTime.Now
            });


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Comment added successfully",
                comment
            });
        }



        // GET: api/Comment/ticket/1
        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetTicketComments(int ticketId)
        {
            var comments = await _context.TicketComments
                .Where(c => c.TicketId == ticketId)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();


            return Ok(comments);
        }
    }
}