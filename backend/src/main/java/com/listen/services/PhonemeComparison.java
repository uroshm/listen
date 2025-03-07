package com.listen.services;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.listen.data.TranscriptionResult;

@Service
public class PhonemeComparison {

    public TranscriptionResult compareTranscription(String transcribedText, String expectedText) {
        List<String> transcribedPhonemes = convertToPhonemes(transcribedText);
        List<String> expectedPhonemes = convertToPhonemes(expectedText);

        int matchCount = (int) Arrays.stream(transcribedPhonemes.toArray())
                .filter(expectedPhonemes::contains)
                .count();

        int totalPhonemes = Math.max(transcribedPhonemes.size(), expectedPhonemes.size());
        double score = (matchCount / (double) totalPhonemes) * 100;

        return new TranscriptionResult(transcribedText, expectedText, score, transcribedPhonemes, expectedPhonemes, matchCount, totalPhonemes);
    }

    private List<String> convertToPhonemes(String text) {
        // Simulate conversion to phonemes for now; you can use CMU's G2P or another library
        return Arrays.stream(text.split(" "))
                .map(word -> word.toLowerCase())  // Convert each word to lowercase as a "fake" phoneme
                .collect(Collectors.toList());
    }
}
