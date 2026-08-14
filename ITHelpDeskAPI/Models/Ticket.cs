namespace ITHelpDeskAPI.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string Description { get; set; } = "";

        public int EmployeeId { get; set; }

        public int? AssignedAgentId { get; set; }

        public int CategoryId { get; set; }

        public int PriorityId { get; set; }

        public int StatusId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Relationships
        public User? Employee { get; set; }

        public User? AssignedAgent { get; set; }

        public Category? Category { get; set; }

        public Priority? Priority { get; set; }

        public Status? Status { get; set; }

        // New Relationships
        public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();

        public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
    }
}