package com.lobos.lobos_server.model;

import java.util.List;

public class Graph {
    private String graphType;
    private String title;
    private String xLabel;
    private String yLabel;
    private List<String> labels; // Labels for x-axis (e.g., parties, races, etc.)
    private List<GraphDataSet> dataSets;

    public Graph(String graphType) {
        this.graphType = graphType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getXLabel() {
        return xLabel;
    }

    public void setXLabel(String xLabel) {
        this.xLabel = xLabel;
    }

    public String getYLabel() {
        return yLabel;
    }

    public void setYLabel(String yLabel) {
        this.yLabel = yLabel;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<GraphDataSet> getDataSets() {
        return dataSets;
    }

    public void setDataSets(List<GraphDataSet> dataSets) {
        this.dataSets = dataSets;
    }

    public String getGraphType() {
        return graphType;
    }

    public void setGraphType(String graphType) {
        this.graphType = graphType;
    }
}