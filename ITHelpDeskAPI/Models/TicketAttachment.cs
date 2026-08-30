namespace ITHelpDeskAPI.Models
{
    public class TicketAttachment
    {
        public int Id { get; set; }

        public int TicketId { get; set; }

        public string FileName { get; set; } = "";

        public string FilePath { get; set; } = "";

        public string ContentType { get; set; } = "";

        public long FileSize { get; set; }

        public int UploadedByUserId { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.Now;

        // Relationships
        public Ticket? Ticket { get; set; }

        public User? UploadedByUser { get; set; }
    }
}
