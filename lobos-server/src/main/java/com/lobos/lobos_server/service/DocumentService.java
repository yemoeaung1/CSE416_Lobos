// package com.lobos.lobos_server.service;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.springframework.stereotype.Service;

// import java.io.File;
// import java.io.IOException;
// import java.util.HashMap;
// import java.util.Map;

// @Service
// public class DocumentService {
//     private final ObjectMapper objectMapper = new ObjectMapper();

//     public Map<String, Object> getStateInfo(String stateAbbr) throws IOException {
//         String stateJSON = "src/main/resources/data/" + stateAbbr + "_info.json";
//         return objectMapper.readValue(new File(stateJSON), Map.class);
//     }
// }

package com.lobos.lobos_server.service;

import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.repository.StateInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    @Autowired
    private StateInfoRepository repository;

    public StateInfo addExampleDocument() {
        StateInfo stateInfo = new StateInfo();
        stateInfo.setState("Utah");
        stateInfo.setLocation("Salt Lake City");
        stateInfo.setStat("Population");

        StateInfo.Details details = new StateInfo.Details();
        details.setTotal(200000);
        details.setMale(100000);
        details.setFemale(100000);
        stateInfo.setDetails(details);

        return repository.save(stateInfo);
    }
}
