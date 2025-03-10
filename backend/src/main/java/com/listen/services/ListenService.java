package com.listen.services;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.listen.data.TranscriptionResult;
import com.listen.data.Widget;
import com.listen.repositories.WidgetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Service
@Slf4j
public class ListenService {

    private final WidgetRepository widgetRepository;
    private final TranscriptionService transcriptionService;
    private final PhonemeComparison phonemeComparison;

    public List<Widget> getAllWidgets() {
        return widgetRepository.findAll();
    }

    public TranscriptionResult uploadAudio(MultipartFile multipartFile, String expectedText) {
        try {
            var file = File.createTempFile("tempAudioFile", ".wav");
            multipartFile.transferTo(file);

            var transcribedText = transcriptionService.transcribeAudio(file.getPath());
            var result = phonemeComparison.compareTranscription(transcribedText, expectedText);
            
            if (!file.delete()) {
                log.warn("Failed to delete temporary file: " + file.getPath());
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
