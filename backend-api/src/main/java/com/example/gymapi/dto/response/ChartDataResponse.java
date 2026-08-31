package com.example.gymapi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ChartDataResponse {
    private List<String> labels;
    private List<Double> values;
    private String titre;
}