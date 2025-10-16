using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Maui.Controls.Platform.Compatibility;
using Microsoft.Maui.Storage;
using System.IdentityModel.Tokens.Jwt;
namespace Desktop.Services;

public static class AuthService
{
    private const string BaseUrl = "http://192.168.100.38:5000";
    private const string TokenKey = "auth_token";
    private static readonly HttpClient client = new();

    public static async Task<string> LoginAsync(string username, string password)
    {
        var payload = new
        {
            username,
            password
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{BaseUrl}/auth/login", content);

        if(!response.IsSuccessStatusCode)
        {
            throw new Exception("Login failed!");
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var token = doc.RootElement.GetProperty("access_token").GetString();

        if (!string.IsNullOrEmpty(token))
        {
            await SecureStorage.SetAsync(TokenKey, token);
            Preferences.Set(TokenKey, token);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        return json;
    }

    public static string? GetToken()
    {
        return Preferences.ContainsKey(TokenKey) ? Preferences.Get(TokenKey, null) : null;
    }

    public static void Logout()
    {
        SecureStorage.Remove(TokenKey);
        Preferences.Remove(TokenKey);
        client.DefaultRequestHeaders.Authorization = null;
    }

    public static async Task<JsonElement> GetMyProfileAsync()
    {
        var response = await client.GetAsync($"{BaseUrl}/auth/me");

        if (!response.IsSuccessStatusCode)
            throw new Exception("Failed to fetch profile");

        var json = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(json).RootElement;
    }

    public static bool IsLoggedIn() => GetToken() != null;

}
