using System;
using Microsoft.Maui.Controls;
using Desktop.Services;
using Microsoft.Maui.Storage;

namespace Desktop.Pages;

public partial class LoginPage : ContentPage
{
    private bool _isPasswordHidden = true;

    public LoginPage()
    {
        InitializeComponent();
        UpdatePasswordIcon();
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        var username = UsernameEntry.Text;
        var password = PasswordEntry.Text;

        ErrorLabel.IsVisible = false;

        try
        {
            var token = await AuthService.LoginAsync(username, password);

            if (AuthService.IsLoggedIn())
            {
                (Shell.Current as AppShell)?.SetShellItems();
                await Shell.Current.GoToAsync("//dashboard");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            ErrorLabel.Text = "Login failed. Please check your credentials.";
            ErrorLabel.IsVisible = true;
        }
    }

    private void TogglePasswordVisibility(object sender, EventArgs e)
    {
        _isPasswordHidden = !_isPasswordHidden;
        PasswordEntry.IsPassword = _isPasswordHidden;
        UpdatePasswordIcon();
    }

    private void UpdatePasswordIcon()
    {
        var icon = _isPasswordHidden ? "eye.png" : "eye_off.png";
        ((ImageButton)((Grid)PasswordEntry.Parent).Children[1]).Source = icon;
    }
}
