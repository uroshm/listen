package com.listen.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.listen.data.TranscriptionResult;
import com.listen.data.Widget;
import com.listen.repositories.WidgetRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Service
public class ListenService {

    private final WidgetRepository widgetRepository;

    public List<Widget> getAllWidgets() {
        return widgetRepository.findAll();
    }

    public TranscriptionResult uploadAudio(MultipartFile file) {
        try {
            File tempAudioFile = File.createTempFile("temp_audio", ".wav");

            // Copy the contents of the MultipartFile into the temp file
            file.transferTo(tempAudioFile);

            // Expected transcription text
            String expectedText = "The cow jumped over the moon";

            // Transcribe the audio file
            String transcribedText = TranscriptionService.transcribeAudio(tempAudioFile.getPath());

            // Compare the transcription with the expected text
            TranscriptionResult result = PhonemeComparison.compareTranscription(transcribedText, expectedText);

            // Clean up temporary file
            tempAudioFile.delete();

            // Output the result as JSON
            System.out.println(result.toString());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
