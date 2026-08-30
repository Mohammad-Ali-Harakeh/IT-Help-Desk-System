using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }


        // GET: api/Notification/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }


        // GET: api/Notification/user/{userId}/unread
        [HttpGet("user/{userId}/unread")]
        public async Task<IActionResult> GetUnreadNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }


        // PUT: api/Notification/read/{id}
        [HttpPut("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound(new
                {
                    message = "Notification not found"
                });
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Notification marked as read"
            });
        }


        // PUT: api/Notification/read-all/{userId}
        [HttpPut("read-all/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "All notifications marked as read"
            });
        }
    }
} 
