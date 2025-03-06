package com.listen.data;

import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class TranscriptionResult {
    private String transcribedText;
    private String expectedText;
    private double score;
    private List<String> transcribedPhonemes;
    private List<String> expectedPhonemes;
    private int matchCount;
    private int totalPhonemes;

    public TranscriptionResult(String transcribedText, String expectedText, double score,
            List<String> transcribedPhonemes, List<String> expectedPhonemes, int matchCount, int totalPhonemes) {
        this.transcribedText = transcribedText;
        this.expectedText = expectedText;
        this.score = score;
        this.transcribedPhonemes = transcribedPhonemes;
        this.expectedPhonemes = expectedPhonemes;
        this.matchCount = matchCount;
        this.totalPhonemes = totalPhonemes;
    }

    @Override
    public String toString() {
        return this.transcribedText + " " + this.expectedText + " " + this.score + " " + this.transcribedPhonemes + " "
                + this.expectedPhonemes + " " + this.matchCount + " " + this.totalPhonemes;
    }
}