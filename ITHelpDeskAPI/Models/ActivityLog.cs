namespace ITHelpDeskAPI.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }

        public string Action { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int TicketId { get; set; }

        public int UserId { get; set; }

        // Relationships
        public Ticket? Ticket { get; set; }

        public User? User { get; set; }
    }
}