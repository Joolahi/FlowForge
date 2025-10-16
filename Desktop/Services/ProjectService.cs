using System.Net.Http;
using System.Net.Http.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using Desktop.Models;
using System.Diagnostics;

namespace Desktop.Services;

public static class ProjectService
{
    private static readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri("http://192.168.100.38:5000/")
    };

    public static async Task<List<Project>> GetProjectsAsync()
    {
        var token = await SecureStorage.GetAsync("auth_token");
        Debug.WriteLine($"Token: {token}");
        if (token != null)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        var response = await _httpClient.GetAsync("projects/");
        Debug.WriteLine($"Status code: {response.StatusCode}");

        try
        {
            var projects = await response.Content.ReadFromJsonAsync<List<Project>>();
            Debug.WriteLine($"✅ Got {projects?.Count ?? 0} projects from backend.");
            return projects ?? new List<Project>();
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"❌ Deserialization error: {ex.Message}");
            var raw = await response.Content.ReadAsStringAsync();
            Debug.WriteLine($"Response content: {raw}");
            throw;
        }
    }
}
