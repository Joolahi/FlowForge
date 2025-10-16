using System;
using System.Collections.ObjectModel;
using Microsoft.Maui.Controls;
using Desktop.Services;
using Desktop.Models;

namespace Desktop.Pages;

public partial class DashboardPage : ContentPage
{
    public ObservableCollection<ProjectViewModel> Projects { get; set; } = new();

    public DashboardPage()
    {
        InitializeComponent();
        ProjectsCollectionView.ItemsSource = Projects;
        LoadProjects();
    }

    private async void LoadProjects()
    {
        try
        {
            var projects = await ProjectService.GetProjectsAsync();

            Projects.Clear();
            foreach (var project in projects)
            {
                Projects.Add(new ProjectViewModel(project));
            }
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", "Failed to load projects.", "OK");
            Console.WriteLine(ex.Message);
        }
    }
}
