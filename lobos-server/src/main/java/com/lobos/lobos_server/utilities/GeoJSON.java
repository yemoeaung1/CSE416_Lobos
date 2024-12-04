package com.lobos.lobos_server.utilities;

import java.util.List;
import java.util.Map;

public class GeoJSON {
    private String type;
    private List<Feature> features;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    public static class Feature {
        private String type;
        private Map<String, Object> properties;
        private Object geometry;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Map<String, Object> getProperties() {
            return properties;
        }

        public void setProperties(Map<String, Object> properties) {
            this.properties = properties;
        }

        public Object getGeometry() {
            return geometry;
        }

        public void setGeometry(Object geometry) {
            this.geometry = geometry;
        }
    }
}

