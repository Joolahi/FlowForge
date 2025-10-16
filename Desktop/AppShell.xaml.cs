using Microsoft.Maui.Controls;
using Desktop.Services;
using System.Diagnostics;

namespace Desktop
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            SetShellItems();
        }

        public void SetShellItems()
        {
            Debug.WriteLine($"User is logged in: {AuthService.IsLoggedIn()}");

            Items.Clear();

            Routing.RegisterRoute("dashboard", typeof(Pages.DashboardPage));
            Routing.RegisterRoute("frontpage", typeof(Pages.FrontPage));
            Routing.RegisterRoute("login", typeof(Pages.LoginPage));

            if (AuthService.IsLoggedIn())
            {
                var dashboardItem = new ShellItem
                {
                    Route = "dashboard",
                    Title = "Dashboard",
                    Items =
                    {
                        new ShellContent
                        {
                            ContentTemplate = new DataTemplate(typeof(Pages.DashboardPage))
                        }
                    }
                };

                // Lisää logout-menuitem ShellItemiin
                var logoutMenuItem = new MenuItem
                {
                    Text = "Logout",
                    IconImageSource = "dotnet_bot.png",
                    IsDestructive = true
                };
                logoutMenuItem.Clicked += OnLogoutClicked;
                dashboardItem.FlyoutDisplayOptions = FlyoutDisplayOptions.AsMultipleItems;

                Items.Add(dashboardItem);
            }
            else
            {
                Items.Add(new ShellContent
                {
                    Route = "frontpage",
                    Title = "FrontPage",
                    ContentTemplate = new DataTemplate(typeof(Pages.FrontPage))
                });

                Items.Add(new ShellContent
                {
                    Route = "login",
                    Title = "Login",
                    ContentTemplate = new DataTemplate(typeof(Pages.LoginPage))
                });
            }
        }

        private async void OnLogoutClicked(object sender, EventArgs e)
        {
            AuthService.Logout();
            SetShellItems();
            await Shell.Current.GoToAsync("//frontpage");
        }
    }
}