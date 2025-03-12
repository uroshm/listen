package com.listen.services;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.io.FileInputStream;
import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

import com.listen.data.TranscriptionResult;
import com.listen.repositories.WidgetRepository;

@ExtendWith(SpringExtension.class)
class ListenServiceTest {

    @Mock
    private WidgetRepository widgetRepository;

    @Mock
    private TranscriptionService transcriptionService;

    @Mock
    private PhonemeComparison phonemeComparison;

    @InjectMocks
    private ListenService listenService;

    @Test
    void uploadAudio() throws IOException {
        FileInputStream fileInputStream = new FileInputStream("src/test/helloWorld_converted.wav");
        MultipartFile file = new MockMultipartFile("file", "cowOverMoon.wav", "audio/wav", fileInputStream);
        when(transcriptionService.transcribeAudio(anyString())).thenReturn("helloWorld");
        when(phonemeComparison.compareTranscription(anyString(), anyString())).thenReturn(new TranscriptionResult());

        var result = listenService.uploadAudio(file, "hello world");

        assertNotNull(result);
    }

}
