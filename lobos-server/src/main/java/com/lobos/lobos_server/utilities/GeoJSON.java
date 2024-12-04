package com.lobos.lobos_server.utilities;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.databind.ObjectMapper;

public class GeoJSON {
    private String type;
    private String name;
    private Object crs;
    private List<Feature> features;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getCrs() {
        return crs;
    }

    public void setCrs(Object crs) {
        this.crs = crs;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    public static GeoJSON parseGeoJsonAsMap(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource("data/" + filename);

        ObjectMapper objectMapper = new ObjectMapper();
        
        Path path = resource.getFile().toPath();

        if (!Files.exists(path)) {
            throw new IOException("GeoJSON file not found: " + filename);
        }

        String geoJsonString = Files.readString(path);
        return objectMapper.readValue(geoJsonString, GeoJSON.class);
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

