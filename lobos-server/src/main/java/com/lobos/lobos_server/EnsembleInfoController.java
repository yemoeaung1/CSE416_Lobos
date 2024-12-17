package com.lobos.lobos_server;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.service.EnsembleInfoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EnsembleInfoController {

    private final EnsembleInfoService ensembleInfoService;

    @Autowired
    public EnsembleInfoController(EnsembleInfoService ensembleInfoService) {
        this.ensembleInfoService = ensembleInfoService;
    }

    @GetMapping("/ensemble/splits")
    public ResponseEntity<Map<String, Object>> getEnsembleInfo(@RequestParam String state) {
       Map<String, Object> data = ensembleInfoService.retrieveSplits(state);
       return ResponseEntity.ok(data);
    }

    @GetMapping("/ensemble/boxplot-data")
    public ResponseEntity<Map<String, Object>> getBoxPlotDataForFilter(String state, String filter, String category) {
        Map<String, Object> data = ensembleInfoService.retrieveBoxPlotData(state, filter, category);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/ensemble/info")
    public ResponseEntity<List<EnsembleInfo>> getAllEnsembleInfo() {
        List<EnsembleInfo> ensembleInfoList = ensembleInfoService.getAllEnsembleInfo();
        return ResponseEntity.ok(ensembleInfoList);
    }

    @GetMapping("/ensemble/district-win-counts")
    public ResponseEntity<Map<String, Object>> getEnsembleTally(@RequestParam String state) {
        Map<String, Object> data = ensembleInfoService.retrieveDistrictWinCounts(state);
        return ResponseEntity.ok(data);
    }
}
