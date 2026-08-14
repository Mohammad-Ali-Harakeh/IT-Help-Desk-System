namespace ITHelpDeskAPI.Models
{
    public class Status
    {
        public int Id { get; set; }

        public string StatusName { get; set; } = "";

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}