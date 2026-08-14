using Microsoft.EntityFrameworkCore;
using ITHelpDeskAPI.Models;

namespace ITHelpDeskAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Ticket> Tickets { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Priority> Priorities { get; set; }

        public DbSet<Status> Statuses { get; set; }

        public DbSet<TicketComment> TicketComments { get; set; }

        public DbSet<ActivityLog> ActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ticket -> Employee
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Employee)
                .WithMany()
                .HasForeignKey(t => t.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket -> Assigned Agent
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.AssignedAgent)
                .WithMany()
                .HasForeignKey(t => t.AssignedAgentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket -> Category
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Tickets)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket -> Priority
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Priority)
                .WithMany(p => p.Tickets)
                .HasForeignKey(t => t.PriorityId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket -> Status
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Status)
                .WithMany(s => s.Tickets)
                .HasForeignKey(t => t.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // TicketComment -> Ticket
            modelBuilder.Entity<TicketComment>()
                .HasOne(tc => tc.Ticket)
                .WithMany(t => t.Comments)
                .HasForeignKey(tc => tc.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketComment -> User
            modelBuilder.Entity<TicketComment>()
                .HasOne(tc => tc.User)
                .WithMany()
                .HasForeignKey(tc => tc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ActivityLog -> Ticket
            modelBuilder.Entity<ActivityLog>()
                .HasOne(al => al.Ticket)
                .WithMany(t => t.ActivityLogs)
                .HasForeignKey(al => al.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // ActivityLog -> User
            modelBuilder.Entity<ActivityLog>()
                .HasOne(al => al.User)
                .WithMany()
                .HasForeignKey(al => al.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, CategoryName = "Hardware" },
                new Category { Id = 2, CategoryName = "Software" },
                new Category { Id = 3, CategoryName = "Network" },
                new Category { Id = 4, CategoryName = "Account" }
            );

            // Seed Priorities
            modelBuilder.Entity<Priority>().HasData(
                new Priority { Id = 1, PriorityName = "Low" },
                new Priority { Id = 2, PriorityName = "Medium" },
                new Priority { Id = 3, PriorityName = "High" }
            );

            // Seed Statuses
            modelBuilder.Entity<Status>().HasData(
                new Status { Id = 1, StatusName = "Open" },
                new Status { Id = 2, StatusName = "In Progress" },
                new Status { Id = 3, StatusName = "Resolved" },
                new Status { Id = 4, StatusName = "Closed" }
            );
        }
    }
} 