package com.lobos.lobos_server;

import com.lobos.lobos_server.service.DocumentService;
import com.lobos.lobos_server.model.StateInfo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.File;

import java.util.HashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SimpleRESTController {
    @Autowired
    private DocumentService documentService;
    
    @PostMapping("/add-example")
    public StateInfo addExample() {
        return documentService.addExampleDocument();
    }

    @GetMapping("/state-info")
    public Map<String, Object> getInfo(
            @RequestParam(value = "state", required = true) String state) {

        ObjectMapper objectMapper = new ObjectMapper();

        String stateAbbr = "";

        switch(state){
            case "Utah": stateAbbr = "ut"; break;
            case "South Carolina": stateAbbr = "sc"; break;
        }

        String stateJSON = "src/main/resources/data/" + stateAbbr + "_info.json";

        try {
            // Read JSON file and map it to a generic Map
            Map<String, Object> data = objectMapper.readValue(new File(stateJSON), Map.class);
            System.out.println(data);

            return data;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
        
        @GetMapping("/state-data")
        public Map<String, Object> getData(
                @RequestParam(value = "state", required = true) String state,
                @RequestParam(value = "location", required = true) String location,
                @RequestParam(value = "stat", required = true) String stat){

            List<String> race_data = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();

            String stateAbbr = "";

            switch(state){
                case "Utah": stateAbbr = "ut"; break;
                case "South Carolina": stateAbbr = "sc"; break;
            }

            String stateJSON = "src/main/resources/data/" + stateAbbr + "_info.json";


            try {

                ArrayList<String> raceName = new ArrayList<>();
                ArrayList<Object> raceEstimate = new ArrayList<>();

                Map<String, Object> data = mapper.readValue(new File(stateJSON), Map.class);
            
                Map<String, Object> stateInfo = (Map<String, Object>) data.get(state);

                for(String key: ((Map<String, Object>)stateInfo.get("Race")).keySet()){
                    raceName.add(key);
                    raceEstimate.add(((Map<String, Object>)((Map<String, Object>)stateInfo.get("Race")).get(key)).get("Estimate"));
                }

                System.out.println(raceName);
                System.out.println(raceEstimate);

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("State", state);
                responseData.put("Location", location);

                responseData.put("Title", stat.substring(0, 1).toUpperCase() + stat.substring(1) + " Distribution");
                responseData.put("Color", "blue");

                responseData.put("x-label", stat);
                // responseData.put("x-min", 0);
                // responseData.put("x-max", 100);

                responseData.put("y-label", "Number of People");
                // responseData.put("y-min", 0);
                // responseData.put("y-max", 100);

                return responseData;
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;

            // JsonNode rootNode = mapper2.readTree(new File(stateJSON));
            // JsonNode raceNode = rootNode.get("Race");

            // Iterator<String> fieldNames = raceNode.fieldNames();
            // while(fieldNames.hasNext()){
            //     String race = fieldNames.next();
            //     System.out.println(race);
            //     JsonNode raceDetails = raceNode.get(race);

            //     // String race_estimation = raceDetails.get("Estimate");
            //     // race_data.add(race_estimation);
            // }

            // System.out.println(race_data);
    }
}