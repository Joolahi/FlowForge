namespace Desktop.Models;

public class ProjectViewModel
{
    private readonly Project _project;

    public ProjectViewModel(Project project)
    {
        _project = project;
    }

    public string Name => _project.Name;
    public string Description => _project.Description;
    public string ProgressText => $"Progress: {_project.Progress}%";
    public double ProgressNormalized => _project.Progress / 100.0;
}
