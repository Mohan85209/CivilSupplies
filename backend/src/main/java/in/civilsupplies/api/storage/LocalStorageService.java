package in.civilsupplies.api.storage;

import in.civilsupplies.api.config.AppProperties;
import in.civilsupplies.api.exception.ApiException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path root;

    public LocalStorageService(AppProperties props) {
        this.root = Path.of(props.storage().localDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to create upload dir " + root, e);
        }
    }

    @Override
    public Stored store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("File is empty.");
        }
        String original = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
        String safe = original.replaceAll("[^A-Za-z0-9._-]", "_");
        String name = UUID.randomUUID() + "_" + safe;
        Path dir = root.resolve(folder);
        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(name);
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String key = folder + "/" + name;
            return new Stored(original, "/files/" + key, key);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }

    @Override
    public String resolveUrl(String key) {
        return "/files/" + key;
    }
}
