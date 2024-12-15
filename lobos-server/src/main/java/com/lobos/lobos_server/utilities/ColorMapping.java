package com.lobos.lobos_server.utilities;

public class ColorMapping {
    private String name;
    private String color;
    private double opacity;

    public ColorMapping(String name, String color, double opacity){
        this.name = name;
        this.color = color;
        this.opacity = opacity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public double getOpacity() {
        return opacity;
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
    }
    
}
