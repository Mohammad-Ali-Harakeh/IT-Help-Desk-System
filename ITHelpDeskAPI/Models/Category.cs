namespace ITHelpDeskAPI.Models
{
	public class Category
	{
		public int Id { get; set; }

		public string CategoryName { get; set; } = "";

		public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
	}
}