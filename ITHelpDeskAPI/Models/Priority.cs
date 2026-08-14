namespace ITHelpDeskAPI.Models
{
    public class Priority
    {
        public int Id { get; set; }

        public string PriorityName { get; set; } = "";

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}