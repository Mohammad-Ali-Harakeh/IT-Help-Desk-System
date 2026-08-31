
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace ITHelpDeskAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AIController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // POST: api/AI/chat
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] AIRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    message = "Message is required."
                });
            }

            try
            {
                var ollamaRequest = new
                {
                    model = "llama3",
                    prompt = request.Message,
                    stream = false
                };

                var json = JsonSerializer.Serialize(ollamaRequest);

                using var content = new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(
                    "http://localhost:11434/api/generate",
                    content
                );

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)response.StatusCode,
                        new
                        {
                            message = "AI service is not available."
                        }
                    );
                }

                var responseContent =
                    await response.Content.ReadAsStringAsync();

                using var document =
                    JsonDocument.Parse(responseContent);

                string answer = "";

                if (document.RootElement.TryGetProperty(
                    "response",
                    out JsonElement responseElement))
                {
                    answer = responseElement.GetString() ?? "";
                }

                return Ok(new
                {
                    response = answer
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "AI service error.",
                    error = ex.Message
                });
            }
        }

        // POST: api/AI/suggest-reply
        [HttpPost("suggest-reply")]
        public async Task<IActionResult> SuggestReply(
            [FromBody] AIRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    message = "Message is required."
                });
            }

            var prompt =
                "You are an IT Help Desk assistant. " +
                "Provide a professional troubleshooting reply " +
                "for the following ticket:\n\n" +
                request.Message;

            return await Chat(
                new AIRequest
                {
                    Message = prompt
                }
            );
        }

        // POST: api/AI/categorize
        [HttpPost("categorize")]
        public async Task<IActionResult> Categorize(
            [FromBody] AIRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    message = "Message is required."
                });
            }

            var prompt =
                "Classify this IT support ticket into exactly one " +
                "of these categories: Hardware, Software, Network, " +
                "Email, Access Request, Other.\n\n" +
                "Ticket:\n" +
                request.Message;

            return await Chat(
                new AIRequest
                {
                    Message = prompt
                }
            );
        }

        // POST: api/AI/priority
        [HttpPost("priority")]
        public async Task<IActionResult> Priority(
            [FromBody] AIRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    message = "Message is required."
                });
            }

            var prompt =
                "Determine the priority of this IT support ticket. " +
                "Choose exactly one: Low, Medium, High, Critical.\n\n" +
                "Ticket:\n" +
                request.Message;

            return await Chat(
                new AIRequest
                {
                    Message = prompt
                }
            );
        }
    }

    public class AIRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}
