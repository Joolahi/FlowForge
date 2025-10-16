using System;
using System.Collections.Generic;

namespace Desktop.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public double Progress { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<TaskModel> Tasks { get; set; } = new(); // 👈 tämä on tärkein osa
}
