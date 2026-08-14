using ITHelpDeskAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.Models;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketController(AppDbContext context)
        {
            _context = context;
        }


        // POST: api/Ticket
        [HttpPost]
        public async Task<IActionResult> CreateTicket(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(ticket);
        }


        // GET: api/Ticket
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets.ToListAsync();

            return Ok(tickets);
        }


        // GET: api/Ticket/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }


        // PUT: api/Ticket/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, Ticket ticket)
        {
            var existingTicket = await _context.Tickets.FindAsync(id);

            if (existingTicket == null)
            {
                return NotFound();
            }

            existingTicket.Title = ticket.Title;
            existingTicket.Description = ticket.Description;
            existingTicket.EmployeeId = ticket.EmployeeId;
            existingTicket.AssignedAgentId = ticket.AssignedAgentId;
            existingTicket.CategoryId = ticket.CategoryId;
            existingTicket.PriorityId = ticket.PriorityId;
            existingTicket.StatusId = ticket.StatusId;

            await _context.SaveChangesAsync();

            return Ok(existingTicket);
        }


        // DELETE: api/Ticket/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket deleted successfully"
            });
        }


        // PUT: api/Ticket/assign/{id}
        [HttpPut("assign/{id}")]
        public async Task<IActionResult> AssignTicket(int id, AssignTicketDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = "Ticket not found"
                });
            }


            ticket.AssignedAgentId = dto.AssignedAgentId;


            _context.ActivityLogs.Add(new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = dto.AssignedAgentId,
                Action = "Ticket assigned to agent",
                CreatedAt = DateTime.Now
            });


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Ticket assigned successfully",
                ticket
            });
        }



        // PUT: api/Ticket/status/{id}
        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateTicketStatus(int id, UpdateStatusDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = "Ticket not found"
                });
            }


            ticket.StatusId = dto.StatusId;


            _context.ActivityLogs.Add(new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = ticket.AssignedAgentId ?? ticket.EmployeeId,
                Action = $"Ticket status changed to {dto.StatusId}",
                CreatedAt = DateTime.Now
            });


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Ticket status updated successfully",
                ticket
            });
        }



        // GET: api/Ticket/{id}/history
        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetTicketHistory(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = "Ticket not found"
                });
            }


            var history = await _context.ActivityLogs
                .Where(a => a.TicketId == id)
                .Include(a => a.User)
                .OrderBy(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Action,
                    a.CreatedAt,
                    User = a.User != null ? a.User.Name : "Unknown"
                })
                .ToListAsync();


            return Ok(new
            {
                ticketId = id,
                history
            });
        }
    }
} 
