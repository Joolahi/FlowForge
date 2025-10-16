using System;
using Microsoft.Maui.Controls;

namespace Desktop.Pages;

public partial class FrontPage : ContentPage
{
    public FrontPage()
    {
        InitializeComponent();
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//login");
    }

    private async void OnRegisterClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//register");
    }
}
