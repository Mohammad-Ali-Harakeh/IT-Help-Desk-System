
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Data;
using ClosedXML.Excel;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Report/statistics
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalTickets = await _context.Tickets.CountAsync();

            var openTickets = await _context.Tickets
                .CountAsync(t => t.StatusId != 4);

            var closedTickets = await _context.Tickets
                .CountAsync(t => t.StatusId == 4);

            var ticketsByCategory = await _context.Tickets
                .GroupBy(t => t.CategoryId)
                .Select(g => new
                {
                    categoryId = g.Key,
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

            var ticketsByStatus = await _context.Tickets
                .GroupBy(t => t.StatusId)
                .Select(g => new
                {
                    statusId = g.Key,
                    count = g.Count()
                })
                .ToListAsync();

            return Ok(new
            {
                totalTickets,
                openTickets,
                closedTickets,
                ticketsByCategory,
                ticketsByPriority,
                ticketsByStatus
            });
        }

        // GET: api/Report/excel
        [HttpGet("excel")]
        public async Task<IActionResult> ExportExcel()
        {
            var tickets = await _context.Tickets
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.CategoryId,
                    t.PriorityId,
                    t.StatusId,
                    t.CreatedAt
                })
                .ToListAsync();

            using var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("Ticket Report");

            worksheet.Cell(1, 1).Value = "Ticket ID";
            worksheet.Cell(1, 2).Value = "Title";
            worksheet.Cell(1, 3).Value = "Description";
            worksheet.Cell(1, 4).Value = "Category";
            worksheet.Cell(1, 5).Value = "Priority";
            worksheet.Cell(1, 6).Value = "Status";
            worksheet.Cell(1, 7).Value = "Created At";

            for (int i = 0; i < tickets.Count; i++)
            {
                int row = i + 2;

                worksheet.Cell(row, 1).Value = tickets[i].Id;
                worksheet.Cell(row, 2).Value = tickets[i].Title;
                worksheet.Cell(row, 3).Value = tickets[i].Description;
                worksheet.Cell(row, 4).Value = tickets[i].CategoryId;
                worksheet.Cell(row, 5).Value = tickets[i].PriorityId;
                worksheet.Cell(row, 6).Value = tickets[i].StatusId;
                worksheet.Cell(row, 7).Value = tickets[i].CreatedAt;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "IT-HelpDesk-Report.xlsx"
            );
        }

        // GET: api/Report/pdf
        [HttpGet("pdf")]
        public async Task<IActionResult> ExportPdf()
        {
            var tickets = await _context.Tickets
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.CategoryId,
                    t.PriorityId,
                    t.StatusId,
                    t.CreatedAt
                })
                .ToListAsync();

            var document = new PdfDocument();

            var page = document.AddPage();

            page.Width = 595;
            page.Height = 842;

            var graphics = XGraphics.FromPdfPage(page);

            var titleFont = new XFont(
                "Arial",
                20,
                XFontStyle.Bold
            );

            var headerFont = new XFont(
                "Arial",
                10,
                XFontStyle.Bold
            );

            var normalFont = new XFont(
                "Arial",
                9,
                XFontStyle.Regular
            );

            graphics.DrawString(
                "IT Help Desk - Ticket Report",
                titleFont,
                XBrushes.Black,
                new XRect(40, 40, 515, 30),
                XStringFormats.TopLeft
            );

            graphics.DrawString(
                $"Total Tickets: {tickets.Count}",
                normalFont,
                XBrushes.Black,
                new XRect(40, 75, 515, 20),
                XStringFormats.TopLeft
            );

            int y = 120;

            graphics.DrawString(
                "ID",
                headerFont,
                XBrushes.Black,
                new XRect(40, y, 35, 20),
                XStringFormats.TopLeft
            );

            graphics.DrawString(
                "Title",
                headerFont,
                XBrushes.Black,
                new XRect(80, y, 180, 20),
                XStringFormats.TopLeft
            );

            graphics.DrawString(
                "Category",
                headerFont,
                XBrushes.Black,
                new XRect(270, y, 70, 20),
                XStringFormats.TopLeft
            );

            graphics.DrawString(
                "Priority",
                headerFont,
                XBrushes.Black,
                new XRect(345, y, 70, 20),
                XStringFormats.TopLeft
            );

            graphics.DrawString(
                "Status",
                headerFont,
                XBrushes.Black,
                new XRect(420, y, 70, 20),
                XStringFormats.TopLeft
            );

            y += 25;

            foreach (var ticket in tickets)
            {
                if (y > 780)
                {
                    page = document.AddPage();

                    page.Width = 595;
                    page.Height = 842;

                    graphics = XGraphics.FromPdfPage(page);

                    y = 40;
                }

                graphics.DrawString(
                    ticket.Id.ToString(),
                    normalFont,
                    XBrushes.Black,
                    new XRect(40, y, 35, 20),
                    XStringFormats.TopLeft
                );

                graphics.DrawString(
                    ticket.Title ?? "",
                    normalFont,
                    XBrushes.Black,
                    new XRect(80, y, 180, 20),
                    XStringFormats.TopLeft
                );

                graphics.DrawString(
                    ticket.CategoryId.ToString(),
                    normalFont,
                    XBrushes.Black,
                    new XRect(270, y, 70, 20),
                    XStringFormats.TopLeft
                );

                graphics.DrawString(
                    ticket.PriorityId.ToString(),
                    normalFont,
                    XBrushes.Black,
                    new XRect(345, y, 70, 20),
                    XStringFormats.TopLeft
                );

                graphics.DrawString(
                    ticket.StatusId.ToString(),
                    normalFont,
                    XBrushes.Black,
                    new XRect(420, y, 70, 20),
                    XStringFormats.TopLeft
                );

                y += 22;
            }

            using var stream = new MemoryStream();

            document.Save(stream, false);

            return File(
                stream.ToArray(),
                "application/pdf",
                "IT-HelpDesk-Report.pdf"
            );
        }
    }
}


