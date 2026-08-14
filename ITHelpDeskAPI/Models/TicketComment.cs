namespace ITHelpDeskAPI.Models
{
    public class TicketComment
    {
        public int Id { get; set; }

        public string Comment { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int TicketId { get; set; }

        public int UserId { get; set; }

        // Relationships
        public Ticket? Ticket { get; set; }

        public User? User { get; set; }
    }
}