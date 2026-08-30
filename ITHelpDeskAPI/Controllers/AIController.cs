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

        private const string OllamaUrl =
            "http://localhost:11434/api/generate";

        private const string Model =
            "llama3.2";

        public AIController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // =========================================================
        // AI TICKET ANALYSIS
        // =========================================================

        [HttpPost("analyze-ticket")]
        public async Task<IActionResult> AnalyzeTicket(
            [FromBody] TicketRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) &&
                string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new
                {
                    message = "Title or description is required."
                });
            }

            string prompt =
                "You are an IT Help Desk AI assistant.\n\n" +

                "Analyze the following support ticket.\n\n" +

                "Ticket Title:\n" +
                request.Title +
                "\n\n" +

                "Ticket Description:\n" +
                request.Description +
                "\n\n" +

                "Determine:\n\n" +

                "1. Category:\n" +
                "- Hardware\n" +
                "- Software\n" +
                "- Network\n" +
                "- Account\n" +
                "- Other\n\n" +

                "2. Priority:\n" +
                "- Low\n" +
                "- Medium\n" +
                "- High\n" +
                "- Critical\n\n" +

                "3. Write a short professional summary.\n\n" +

                "4. Give practical troubleshooting suggestions.\n\n" +

                "Return ONLY valid JSON using exactly these properties:\n\n" +

                "category: Hardware\n" +
                "priority: High\n" +
                "summary: Short summary\n" +
                "suggestion: Troubleshooting suggestion\n\n" +

                "Do not add markdown.\n" +
                "Do not add ```json.\n" +
                "Do not add explanations outside the JSON.";

            try
            {
                string aiResponse = await AskOllama(prompt);

                string cleanedResponse =
                    CleanJsonResponse(aiResponse);

                var result =
                    JsonSerializer.Deserialize<AITicketResult>(
                        cleanedResponse,
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                if (result == null)
                {
                    return StatusCode(500, new
                    {
                        message = "AI returned an invalid response."
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "AI Analyze Error: " + ex.Message);

                return StatusCode(500, new
                {
                    message =
                        "Failed to communicate with Ollama.",
                    error = ex.Message
                });
            }
        }


        // =========================================================
        // AI ASSISTANT / CHATBOT
        // =========================================================

        [HttpPost("assistant")]
        public async Task<IActionResult> Assistant(
            [FromBody] AssistantRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    message = "Message is required."
                });
            }

            string prompt =
                "You are an IT Help Desk AI assistant.\n\n" +

                "The user has an IT problem.\n\n" +

                "User message:\n" +
                request.Message +
                "\n\n" +

                "Provide a helpful troubleshooting response.\n\n" +

                "Rules:\n" +
                "- Be professional.\n" +
                "- Keep the answer clear and practical.\n" +
                "- Give numbered steps when appropriate.\n" +
                "- Do not invent information.\n" +
                "- If the issue may be security-related, recommend contacting IT support.";

            try
            {
                string aiResponse =
                    await AskOllama(prompt);

                return Ok(new
                {
                    response = aiResponse
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "AI Assistant Error: " + ex.Message);

                return StatusCode(500, new
                {
                    message =
                        "Failed to communicate with Ollama.",
                    error = ex.Message
                });
            }
        }


        // =========================================================
        // AI TICKET SUMMARY
        // =========================================================

        [HttpPost("summarize-ticket")]
        public async Task<IActionResult> SummarizeTicket(
            [FromBody] TicketRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) &&
                string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new
                {
                    message = "Ticket information is required."
                });
            }

            string prompt =
                "You are an IT Help Desk assistant.\n\n" +

                "Create a short professional summary of this ticket.\n\n" +

                "Title:\n" +
                request.Title +
                "\n\n" +

                "Description:\n" +
                request.Description +
                "\n\n" +

                "Return only the summary.";

            try
            {
                string summary =
                    await AskOllama(prompt);

                return Ok(new
                {
                    summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message =
                        "Failed to generate ticket summary.",
                    error = ex.Message
                });
            }
        }


        // =========================================================
        // OLLAMA REQUEST
        // =========================================================

        private async Task<string> AskOllama(string prompt)
        {
            var requestBody = new
            {
                model = Model,
                prompt = prompt,
                stream = false
            };

            string json =
                JsonSerializer.Serialize(requestBody);

            using var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            using HttpResponseMessage response =
                await _httpClient.PostAsync(
                    OllamaUrl,
                    content);

            string responseBody =
                await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(
                    $"Ollama returned {response.StatusCode}: {responseBody}");
            }

            using JsonDocument document =
                JsonDocument.Parse(responseBody);

            if (!document.RootElement.TryGetProperty(
                    "response",
                    out JsonElement responseElement))
            {
                throw new Exception(
                    "Ollama response does not contain a response field.");
            }

            return responseElement.GetString() ?? "";
        }


        // =========================================================
        // CLEAN AI JSON
        // =========================================================

        private string CleanJsonResponse(string response)
        {
            response = response.Trim();

            if (response.StartsWith("```json"))
            {
                response = response.Substring(7);
            }

            if (response.StartsWith("```"))
            {
                response = response.Substring(3);
            }

            if (response.EndsWith("```"))
            {
                response = response.Substring(
                    0,
                    response.Length - 3);
            }

            return response.Trim();
        }
    }


    // =============================================================
    // REQUEST MODELS
    // =============================================================

    public class TicketRequest
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
    }


    public class AssistantRequest
    {
        public string Message { get; set; } = "";
    }


    // =============================================================
    // AI RESULT
    // =============================================================

    public class AITicketResult
    {
        public string Category { get; set; } = "Other";

        public string Priority { get; set; } = "Low";

        public string Summary { get; set; } = "";

        public string Suggestion { get; set; } = "";
    }
}