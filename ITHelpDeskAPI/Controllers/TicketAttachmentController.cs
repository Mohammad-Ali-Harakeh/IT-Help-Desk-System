using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.Models;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketAttachmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public TicketAttachmentController(
            AppDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // POST: api/TicketAttachment/upload/{ticketId}
        [HttpPost("upload/{ticketId}")]
        public async Task<IActionResult> UploadAttachment(
            int ticketId,
            IFormFile file,
            [FromForm] int uploadedByUserId)
        {
            // Check if ticket exists
            var ticket = await _context.Tickets.FindAsync(ticketId);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = "Ticket not found"
                });
            }

            // Check if file exists
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Please select a file"
                });
            }


            // Create uploads folder
            var uploadsFolder = Path.Combine(
                _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                "uploads"
            );

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }


            // Generate unique file name
            var uniqueFileName = Guid.NewGuid().ToString()
                                  + Path.GetExtension(file.FileName);

            var filePath = Path.Combine(
                uploadsFolder,
                uniqueFileName
            );


            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }


            // Save information in database
            var attachment = new TicketAttachment
            {
                TicketId = ticketId,
                FileName = file.FileName,
                FilePath = "/uploads/" + uniqueFileName,
                ContentType = file.ContentType,
                FileSize = file.Length,
                UploadedByUserId = uploadedByUserId,
                UploadedAt = DateTime.Now
            };

            _context.TicketAttachments.Add(attachment);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "File uploaded successfully",
                attachment
            });
        }


        // GET: api/TicketAttachment/ticket/{ticketId}
        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetTicketAttachments(int ticketId)
        {
            var attachments = await _context.TicketAttachments
                .Where(a => a.TicketId == ticketId)
                .Include(a => a.UploadedByUser)
                .OrderByDescending(a => a.UploadedAt)
                .Select(a => new
                {
                    a.Id,
                    a.FileName,
                    a.FilePath,
                    a.ContentType,
                    a.FileSize,
                    a.UploadedAt,
                    UploadedBy = a.UploadedByUser != null
                        ? a.UploadedByUser.Name
                        : "Unknown"
                })
                .ToListAsync();

            return Ok(attachments);
        }
    }
} 