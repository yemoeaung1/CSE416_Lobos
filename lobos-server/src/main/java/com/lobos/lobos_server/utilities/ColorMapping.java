package com.lobos.lobos_server.utilities;

public class ColorMapping {
    private String color;
    private double opacity;

    public ColorMapping(String color, double opacity){
        this.color = color;
        this.opacity = opacity;
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
