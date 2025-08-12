package team.bham.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import team.bham.domain.VoiceRecording;
import team.bham.repository.VoiceRecordingRepository;

@Service
@Transactional
public class VoiceRecordingService {

    private final VoiceRecordingRepository voiceRecordingRepository;
    private final Path fileStoragePath;

    @Autowired
    public VoiceRecordingService(VoiceRecordingRepository voiceRecordingRepository, Path fileStoragePath) {
        this.voiceRecordingRepository = voiceRecordingRepository;
        this.fileStoragePath = fileStoragePath;
        try {
            Files.createDirectories(this.fileStoragePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directory", e);
        }
    }

    private String sanitizeFilename(String filename) {
        String sanitizedFilename = filename.replaceAll("[/\\\\:*?\"<>|]", "");
        if (sanitizedFilename.length() > 255) {
            sanitizedFilename = sanitizedFilename.substring(0, 255);
        }
        if (sanitizedFilename.trim().isEmpty()) {
            sanitizedFilename = "default_" + System.currentTimeMillis();
        }
        return sanitizedFilename;
    }

    public VoiceRecording storeFile(MultipartFile file) {
        try {
            String fileName = sanitizeFilename(file.getOriginalFilename());
            Path targetLocation = this.fileStoragePath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            VoiceRecording voiceRecording = new VoiceRecording();
            voiceRecording.setFilePath(targetLocation.toString());
            voiceRecording.setTitle(fileName);

            return voiceRecordingRepository.save(voiceRecording);
        } catch (IOException exception) {
            throw new RuntimeException("Error storing file", exception);
        }
    }

    public VoiceRecording save(VoiceRecording voiceRecording) {
        return voiceRecordingRepository.save(voiceRecording);
    }

    @Transactional(readOnly = true)
    public Optional<VoiceRecording> findOne(Long id) {
        return voiceRecordingRepository.findById(id);
    }

    public void delete(Long id) {
        voiceRecordingRepository.deleteById(id);
    }
}
